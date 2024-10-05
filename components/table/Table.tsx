import * as React from 'react';
import { DataTable as DT } from 'react-native-paper';

const Table = (props: any) => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 6, 7]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, props.data.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DT>
    <DT.Header>
      {props.columns.map((column: any, index: any) => (
        <DT.Title key={index} numeric={column.numeric}>
          {column.title}
        </DT.Title>
      ))}
    </DT.Header>

    {props.data.slice(from, to).map((item: any, index: any) => (
      <DT.Row key={index}>
        {props.columns.map((column: any, colIndex: any) => (
          <DT.Cell key={colIndex} numeric={column.numeric}>
            {column.accessor(item)}
          </DT.Cell>
        ))}
      </DT.Row>
    ))}

    <DT.Pagination
      page={page}
      numberOfPages={Math.ceil(props.data.length / itemsPerPage)}
      onPageChange={(page) => setPage(page)}
      label={`${from + 1}-${to} of ${props.data.length}`}
      numberOfItemsPerPageList={props.itemsPerPageList}
      numberOfItemsPerPage={itemsPerPage}
      onItemsPerPageChange={props.setItemsPerPage}
      showFastPaginationControls
      selectPageDropdownLabel={'Rows per page'}
    />
  </DT>
  );
};

export default Table;