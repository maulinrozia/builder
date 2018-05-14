import React from 'react'
import classnames from 'classnames'
import Attribute from '../attribute'
import GutenbergModal from './gutenbergModal'
import lodash from 'lodash'
/* Working prototype */
export default class Component extends Attribute {
  constructor (props) {
    super(props)
    this.openEditor = this.openEditor.bind(this)
    this.iframeLoaded = this.iframeLoaded.bind(this)
    this.updateValueFromIframe = this.updateValueFromIframe.bind(this)
  }

  openEditor (e) {
    e.preventDefault()
    this.setState({ showEditor: true })
  }

  closeEditor () {
    this.setState({ showEditor: false })
  }

  iframeLoaded () {
    const { value } = this.state
    const window = this.iframe.contentWindow
    const wpData = window.wp.data
    // Subscribe to data change
    const debounce = lodash.debounce(this.updateValueFromIframe.bind(this), 500)
    if (!window._wpGutenbergPost) {
      return
    }
    wpData.subscribe(debounce)
    // Set current content
    // Editor settings
    const editorSettings = {
      alignWide: false,
      availableTemplates: [],
      blockTypes: true,
      disableCustomColors: false,
      disablePostFormats: false,
      titlePlaceholder: '',
      bodyPlaceholder: 'Add content to apply to VCWB ;)'
    }
    const newPost = Object.assign({}, window._wpGutenbergPost)
    newPost.content.raw = value
    newPost.content.rendered = value
    const editor = wpData.dispatch('core/editor')
    // remove autosave
    if (!!editor.autosave && typeof editor.autosave === 'function') {
      editor.autosave = () => {}
    }
    editor.setupEditor(newPost, editorSettings)
  }

  updateValueFromIframe () {
    const wpData = this.iframe.contentWindow.wp.data
    const value = wpData.select('core/editor').getEditedPostContent()
    this.setFieldValue(value)
  }

  render () {
    let { showEditor } = this.state
    const editor = () => {
      if (showEditor) {
        const closeClasses = classnames({
          'vcv-ui-icon': true,
          'vcv-ui-icon-close-thin': true
        })
        const iframeURL = window.vcvGutenbergEditorUrl ? window.vcvGutenbergEditorUrl : '/wp-admin/post-new.php?post_type=vcv_gutenberg_attr' // change with vcv action
        return (
          <GutenbergModal>
            <div className='vcv-gutenberg-modal-inner'>
              <button className='vcv-gutenberg-modal-close-button' onClick={this.closeEditor.bind(this)}>
                <i className={closeClasses} />
              </button>
              <iframe id='vcv-gutenberg-attribute-modal-iframe' ref={(iframe) => { this.iframe = iframe }} src={iframeURL} onLoad={this.iframeLoaded} />
            </div>
          </GutenbergModal>
        )
      }
    }
    return (
      <React.Fragment>
        <button className='vcv-ui-form-button vcv-ui-form-button--default' onClick={this.openEditor}>
          Open Gutenberg
        </button>
        {editor()}
      </React.Fragment>
    )
  }
}
