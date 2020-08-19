controlpanel = window.controlpanel || {};

var markup = []
var _button = null

controlpanel.init = function(divIndex, button, divList, divItem){
  _divIndex = divIndex
  _button = button
  _button.onclick = onClick
  _divList = divList
  _divItem = divItem
  index.load( onIndexLoad )
}

controlpanel.display = function (response) {
  _divList.innerHTML = controls(response)
  _divItem.innerHTML = ""
}

controlpanel.displayIndex = function (response) {
  markup = []
  response.map(paragraph => markup.push(rowIndex(paragraph)) )
  finalMarkup = `${markup.join("\n")}`
  _divIndex.innerHTML = finalMarkup
}

function rowIndex(paragraph){
  return `<p>${paragraph}</p>`
}

controlpanel.display_item = function (response) {
  markup = row(response, false, true)
  html =  `
  <h5 class="details-table-heading">Item details</h5> 
  <table class="details-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Item</th>
        <th>Price</th>
        <th>SKU</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
    ${markup.join("\n")}
    </tbody>
  </table>
  `;
  _divItem.innerHTML = html
}

function row(inventory, canClick, showId) {
  rowMarkup = []
  id = inventory['id']
  if (id != null && canClick){
    rowMarkup.push(`<tr class="divTableRow clickable">`)
  }
  else{
    rowMarkup.push('<tr class="divTableRow">')
  }
  for(var propertyName in inventory) {
    value = inventory[propertyName]
    if (id == null || (value != id || showId)){
      rowMarkup.push(`<td class="divTableCell ${propertyName}-col">${value}</td>`) 
    }
  }
  if (id != null && canClick){
    rowMarkup.push(`<td><button onclick="inventory.load_by_id(${id}, onInventoryItemLoad)">View details</button></td>`)
  }
  rowMarkup.push('</tr>')
  return rowMarkup
}

function controls(response) {
  markup = []
  markup.push('<table class="primary-table">')
  markup.push('<thead>')
  markup.push('<tr>')
  markup.push('<th>Item</th><th>Price</th><th>SKU</th><th> </th>')
  markup.push('</tr>')
  markup.push('</thead>')
  markup.push('<tbody>')
  response.map(inventory => row(inventory, true, false).map(output => markup.push(output)) )
  rowMarkup.push('</tbody>')
  rowMarkup.push('</table>')
  return `${markup.join("\n")}`
}

function onClick() {
  inventory.load( onInventoryLoad )
}

function onInventoryLoad(response) {
  controlpanel.display(response)
}

function onInventoryItemLoad(response) {
  controlpanel.display_item(response)
}

function onIndexLoad(response) {
  controlpanel.displayIndex(response)
}
