import React from 'react'
import { Pagination } from 'antd';

function PaginationAdmin(prop) { 
  
  return (
    <div>
      <Pagination align="center" defaultPageSize={prop.itemsPerPage} defaultCurrent={1}
       total={prop.userData.length} onChange={(page) => prop.setCurrentPage(page)}   className="custom-pagination"
       />
       <style>
  {`
    .custom-pagination .ant-pagination-item-active {
      border-color: #f0c040 ;
      background-color: white ;
      color: white ;
    }
  
    .custom-pagination .ant-pagination-item:focus-visible,
    .custom-pagination .ant-pagination-item:focus {
      outline: none ;
      box-shadow: none ;
    }
  `}
</style>

    </div>
  )
}

export default PaginationAdmin
