import React, { Component } from 'react'
import './Table.scss'

class Table extends Component {
  constructor(props){
    super(props)
    this.state = {
      expandedKeys: props.expandedKeys || {}
    }
  }

  renderCell = (rowData, column) => {
    const cellData = column.key ? rowData[column.key] : null
    return column.customDataRender ? column.customDataRender(this, cellData, rowData) : cellData
  }

  updateExpanded = ids => {
    this.setState({
      expandedKeys: ids
    })
  }

  render() {
    const { data = [], columns, rowKey, expander } = this.props
    const { expandedKeys } = this.state

    const showHeader = columns.filter(c => c.title).length > 0

    return (
      <table className="oc-table">
        <tbody>
          {showHeader &&
            <tr className="oc-table-header-row">
              {columns.map((c, i) => (
                <th key={`tableheader${i}`} style={{width: c.size || 'auto'}} className="oc-table-header-cell">
                  {c.customHeaderRender ? c.customHeaderRender() : c.title }
                </th>
              ))}
            </tr>
          }
          {(data || []).map((d, i) => {
            const row = <tr key={`tablerow${i}`} className="oc-table-data-row">
              {columns.map((c, j) => (
                <td key={`tablecell${i}-${j}`} style={{width: c.size || 'auto'}} className={`oc-table-data-cell ${c.tdclasses || ''}`} data-th={c.title}>
                  {this.renderCell(d, c)}
                </td>
              ))}
            </tr>

            if(rowKey && expander && expandedKeys[d[rowKey]]){
              return [row, <tr><td colSpan={columns.length}>{expander(d)}</td></tr>]
            }else{
              return row
            }
          })}
        </tbody>
      </table>
    )
  }
}

export default Table
