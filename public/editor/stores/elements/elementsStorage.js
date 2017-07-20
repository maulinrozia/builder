import {addStorage, getStorage, getService} from 'vc-cake'
import {rebuildRawLayout, isElementOneRelation, addRowColumnBackground} from './lib/tools'
addStorage('elements', (storage) => {
  const documentManager = getService('document')
  // const timeMachineStorage = getStorage('timeMachine')
  const cook = getService('cook')
  const historyStorage = getStorage('history')
  const utils = getService('utils')
  const wordpressDataStorage = getStorage('wordpressData')
  const updateTimeMachine = () => {
    wordpressDataStorage.state('status').set({ status: 'changed' })
    historyStorage.trigger('add', documentManager.all())
  }
  let substituteIds = {}
  const sanitizeData = (data) => {
    const newData = Object.assign({}, data || {})
    Object.keys(data).forEach((key) => {
      let element = cook.get(data[ key ])
      if (!element) {
        delete newData[ key ]
      }
    })
    return newData
  }
  storage.on('add', (elementData, wrap = true, options = {}) => {
    let createdElements = []
    let element = cook.get(elementData)
    if (!element) {
      return
    }
    if (wrap && !element.get('parent') && !element.relatedTo([ 'RootElements' ])) {
      const rowElementSettings = cook.get({ tag: 'row' })
      let rowElement = documentManager.create(rowElementSettings.toJS())
      createdElements.push(rowElement.id)
      const columnElementSettings = cook.get({ tag: 'column', parent: rowElement.id }).toJS()
      let columnElement = documentManager.create(columnElementSettings)
      createdElements.push(columnElement.id)
      elementData.parent = columnElement.id
      rebuildRawLayout(rowElement.id, {}, documentManager, options)
    }
    let data = documentManager.create(elementData, {
      insertAfter: options && options.insertAfter ? options.insertAfter : false
    })
    createdElements.push(data.id)

    if (wrap && element.get('tag') === 'row') {
      let columnData = cook.get({ tag: 'column', parent: data.id })
      if (columnData) {
        let columnElement = documentManager.create(columnData.toJS())
        createdElements.push(columnElement.id)
      }
    }
    // if (wrap && element.get('tag') === 'tabsWithSlide') {
    //   let tabData = cook.get({ tag: 'tab', parent: data.id })
    //   if (tabData) {
    //     let tabElement = documentManager.create(tabData.toJS())
    //     createdElements.push(tabElement.id)
    //   }
    // }
    if (data.tag === 'column') {
      let rowElement = documentManager.get(data.parent)
      rebuildRawLayout(rowElement.id, { action: options.action === 'merge' ? 'mergeColumn' : 'columnAdd', columnSize: data.size }, documentManager)
      storage.trigger('update', rowElement.id, rowElement, '', options)
    }
    if (data.tag === 'row') {
      if (data.layout && data.layout.layoutData && data.layout.layoutData.length) {
        rebuildRawLayout(data.id, { layout: data.layout.layoutData }, documentManager)
        data.layout.layoutData = undefined
      } else {
        rebuildRawLayout(data.id, {}, documentManager)
      }
    }
    if (!options.silent) {
      storage.state('elementAdd').set(data)
      storage.state('document').set(documentManager.children(false))
      updateTimeMachine()
    }
  })
  storage.on('update', (id, element, source = '', options = {}) => {
    if (element.tag === 'row' && element.layout && element.layout.layoutData && element.layout.layoutData.length) {
      rebuildRawLayout(id, { layout: element.layout.layoutData }, documentManager)
      element.layout.layoutData = undefined
    }
    documentManager.update(id, element)
    storage.state(`element:${id}`).set(element, source)
    if (element.tag === 'column') {
      addRowColumnBackground(id, element, documentManager)
      let rowElement = documentManager.get(element.parent)
      storage.trigger('update', rowElement.id, rowElement)
    }
    if (!options.silent) {
      updateTimeMachine(source || 'elements')
    }
  })
  storage.on('remove', (id) => {
    let element = documentManager.get(id)
    if (!element) {
      return
    }
    let parent = element && element.parent ? documentManager.get(element.parent) : false
    documentManager.delete(id)
    if (parent && !documentManager.children(parent.id).length && element.tag === isElementOneRelation(parent.id, documentManager, cook)) {
      documentManager.delete(parent.id)
      parent = parent.parent ? documentManager.get(parent.parent) : false
    } else if (element.tag === 'column') {
      let rowElement = documentManager.get(parent.id)
      rebuildRawLayout(rowElement.id, { action: 'columnRemove', size: element.size }, documentManager)
      addRowColumnBackground(id, element, documentManager)
      storage.trigger('update', rowElement.id, documentManager.get(parent.id))
    }
    storage.state(`element:${id}`).delete()
    if (parent && element.tag !== 'column') {
      storage.state(`element:${parent.id}`).set(parent)
    } else {
      storage.state('document').set(documentManager.children(false))
    }
    updateTimeMachine()
  })
  storage.on('clone', (id) => {
    let dolly = documentManager.clone(id)
    if (dolly.tag === 'column') {
      let rowElement = documentManager.get(dolly.parent)
      rebuildRawLayout(rowElement.id, { action: 'columnClone' }, documentManager)
      storage.trigger('update', rowElement.id, rowElement)
    }
    if (dolly.parent) {
      storage.state('element:' + dolly.parent).set(documentManager.get(dolly.parent))
    } else {
      storage.state('document').set(documentManager.children(false))
    }
    updateTimeMachine()
  }, {
    debounce: 250
  })
  storage.on('move', (id, data) => {
    let element = documentManager.get(id)
    if (data.action === 'after') {
      documentManager.moveAfter(id, data.related)
    } else if (data.action === 'append') {
      documentManager.appendTo(id, data.related)
    } else {
      documentManager.moveBefore(id, data.related)
    }
    if (element.tag === 'column') {
      // rebuild previous column
      rebuildRawLayout(element.parent, {}, documentManager)
      addRowColumnBackground(element.id, element, documentManager)
      // rebuild next column
      let newElement = documentManager.get(id)
      addRowColumnBackground(newElement.id, newElement, documentManager)
      rebuildRawLayout(newElement.parent, {}, documentManager)
    }
    storage.state('document').set(documentManager.children(false))
    updateTimeMachine()
  })
  const mergeChildrenLayout = (data, parent) => {
    const children = Object.keys(data).filter((key) => {
      const element = data[ key ]
      return element.parent === parent
    })
    children.sort((a, b) => {
      if (typeof data[ a ].order === 'undefined') {
        data[ a ].order = 0
      }
      if (typeof data[ b ].order === 'undefined') {
        data[ b ].order = 0
      }
      return data[ a ].order - data[ b ].order
    })
    children.forEach((key) => {
      const element = data[ key ]
      const newId = utils.createKey()
      const oldId = '' + element.id
      if (substituteIds[ oldId ]) {
        element.id = substituteIds[ oldId ]
      } else {
        substituteIds[ oldId ] = newId
        element.id = newId
      }
      if (element.parent && substituteIds[ element.parent ]) {
        element.parent = substituteIds[ element.parent ]
      } else if (element.parent && !substituteIds[ element.parent ]) {
        substituteIds[ element.parent ] = utils.createKey()
        element.parent = substituteIds[ element.parent ]
      }
      delete element.order
      storage.trigger('add', element, false, { silent: true, action: 'merge' })
      mergeChildrenLayout(data, oldId)
    })
  }
  storage.on('merge', (content) => {
    const layoutData = JSON.parse(JSON.stringify(content))
    mergeChildrenLayout(layoutData, false)
    storage.state('document').set(documentManager.children(false), 'merge')
    substituteIds = {}
    updateTimeMachine()
  }, {
    debounce: 250,
    async: true
  })
  storage.on('reset', (data) => {
    documentManager.reset(sanitizeData(data))
    historyStorage.trigger('init', data)
    storage.state('document').set(documentManager.children(false))
  })
  storage.on('updateAll', (data) => {
    documentManager.reset(sanitizeData(data))
    storage.state('document').set(documentManager.children(false))
  })
})
