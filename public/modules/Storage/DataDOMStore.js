var Mediator = require('../../helpers/Mediator');
var DataStore = {
    document: null,
    add: function(element, parentNode) {
        if(parentNode) {
            var DOMElement = this.document.createElement(element.element);
            var elementId = document.createAttribute("id");       // Create a "id" attribute
            elementId.value = element.id;                           // Set the value of the class attribute
            DOMElement.setAttributeNode(elementId);
            parentNode.appendChild(DOMElement);
        }
        // this.resetActiveNode(); // @todo need to find new way to sync with current node
        return DOMElement || false;
    },
    remove: function(id) {
        var DOMElement = this.document.getElementById( id );
        if(DOMElement) {
            DOMElement.parentNode.removeChild( DOMElement );
            return true;
        }
        return false;
    }
};

// Data module
var Data = {
    activeNode: null,
    resetActiveNode: function() {
        this.activeNode = null;
    },
};
Mediator.installTo(Data);

Data.subscribe('data:activeNode', function(id){
    DataStore.activeNode = DataStore.document.getElementById(id);
});

Data.subscribe('data:add', function(element) {
    DataStore.add(element, DataStore.activeNode) && Data.publish('data:changed', DataStore.document);
});
Data.subscribe('data:remove', function(id) {
    DataStore.remove(id) && Data.publish('data:changed', DataStore.document);
});
Data.subscribe('data:sync', function(){
    var dataString = '<Root id="vc-v-root-element">' + window.document.getElementById('vc_v-content').value + '</Root>';
    var parser = new DOMParser();
    DataStore.document = parser.parseFromString(dataString, 'text/xml');
    Data.publish('data:changed', DataStore.document);
});
window.vcData = Data;
module.exports = Data;