import React from 'react';
import { GridWithHocs as Grid, dateFormatter, numberFormatter, DEFAULT_GRID_PROPS,  FilterType, GridStateType  } from '@modeln/modn-phoenix-ui';
import Icon from '@ant-design/icons';

import { ReactComponent as EditSvg } from '@modeln/modn-phoenix-ui/resources/icons/edit.svg';
import { ReactComponent as CommentSvg } from '@modeln/modn-phoenix-ui/resources/icons/comments.svg';
import { ReactComponent as DeleteSvg } from '@modeln/modn-phoenix-ui/resources/icons/delete.svg';
import { DATA, COMMENTS_DATA } from './DATA';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
const { localStorage } = window;

type DataType = {
  id: number;
  athlete: string;
};

const TABLE_COLUMNS = [
    {
      field: 'athlete',
      filter: 'agTextColumnFilter',
      cellEditor: 'inputEditor',
      enableRowGroup: true,
      cellRenderer: 'inputRenderer',
      editable: true,
      cellEditorParams: {
        additionalProps: {
          getRules: () => [
            {
              required: true,
              message: 'Required',
            },
          ],
        },
      },
      cellRendererParams: {
        additionalProps: {
          getRules: () => [
            {
              required: true,
              message: 'Required',
            },
          ],
        },
      },
    },
    {
      field: 'age',
      minWidth: 120,
      enableRowGroup: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: numberFormatter({
        minimumIntegerDigits: 2,
      }),
    },
    {
      field: 'date',
      filter: 'agDateColumnFilter',
    },
    {
      field: 'country',
    },
    {
      field: 'gold',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'silver',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'bronze',
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'total',
      filter: false,
    },
    {
      field: 'status',
      cellRenderer: 'statusRenderer',
    },
    {
      field: 'updated',
      cellRenderer: 'abbrevationRenderer',
      cellRendererParams: {
        additionalProps: {
          valueFormatter: dateFormatter({
            formatString: 'MM/DD/YYYY',
          }),
          abbrevationFieldName: 'abbrevation',
          tooltipFieldName: 'athlete',
        },
      },
    },
    {
      field: 'commentsCount',
      width: 1,
      headerName: '',
      cellRenderer: 'commentsRenderer',
    },
  ];
  
  const ACTIONS = [
    {
        label: 'New',
        name: 'new',
        type: 'primary',    
      },
      {
        label: 'Edit',
        name: 'edit',
        selected: true
        },
        {
            label: 'Delete',
            name: 'delete',
            selected: true
        },
          
  ];

const GridComponent = () => {
    return (
        <div style={{ marginTop: 20, height: 730 }}>
        <Grid
          id="grid-storybook"
          actions={ACTIONS}
          columnDefs={TABLE_COLUMNS}
          getHiddenActions={() => ({
            apply: 'This action is disabled',
          })}
          getDisabledActions={() => ({
            new: 'This action is disabled',
          })}
          rowActions={[
            {
              label: 'Save',
              name: 'save',
            },
            {
              label: 'Delete',
              name: 'delete',
            },
            {
              label: 'Update',
              name: 'update',
            },
          ]}
          getChildCount={(data: any) => {
            return data ? data.childCount : undefined;
          }}
          onGridReady={(params: GridReadyEvent) => {
            // quickFiltersGetOnGridReadyFn.current!(params.api);
            params.api.setServerSideDatasource({
              getRows: (subParams: any) => {
                console.log('!@#', subParams);
                setTimeout(() => {
                  let data = DATA;
                  if (subParams.request.rowGroupCols.length) {
                    const { groupKeys, rowGroupCols } = subParams.request;

                    groupKeys.forEach((key: string, index: number) => {
                      const rowGroup = rowGroupCols[index];
                      // @ts-ignore
                      data = data.filter((item) => item[rowGroup.field] === key);
                    });

                    if (groupKeys.length !== rowGroupCols.length) {
                      const rowGroupCol = rowGroupCols[groupKeys.length];
                      const key = rowGroupCol.field;
                      const rowCountObj = {};

                      data = data.filter((value: any, index: any, self: any) => {
                        // @ts-ignore
                        rowCountObj[value[key]] = self.filter((m) => m[key] === value[key]).length;
                        // @ts-ignore
                        return self.findIndex((m) => m[key] === value[key]) === index;
                      });

                      data.forEach((item: any) => {
                        // @ts-ignore
                        item.childCount = rowCountObj[item[key]];
                      });
                    }
                  }

                  const result = data.slice(
                    subParams.request.startRow,
                    subParams.request.startRow + DEFAULT_GRID_PROPS.paginationPageSize,
                  );

                  subParams.successCallback(
                    result,
                    data.length,
                    // DATA.length > subParams.request.startRow + DEFAULT_GRID_PROPS.paginationPageSize
                    //   ? -1
                    //   : DATA.length,
                  );
                }, 100);
              },
            });
          }}
          groupUseEntireRow
          initialFilters={
            localStorage.getItem('GRID_FILTERS')
              ? JSON.parse(localStorage.getItem('GRID_FILTERS')!)
              : undefined
          }
          initialGridState={
            localStorage.getItem('GRID_CURRENT_STATE')
              ? JSON.parse(localStorage.getItem('GRID_CURRENT_STATE')!)
              : undefined
          }
          autoGroupColumnDef={{
            minWidth: 200,
            headerName: 'GROUP',
          }}
          onFiltersChanged={(filters: FilterType[]) => {
            localStorage.setItem('GRID_FILTERS', JSON.stringify(filters));
          }}
          onGridStateChanged={(data: GridStateType) => {
            localStorage.setItem('GRID_CURRENT_STATE', JSON.stringify(data));
          }}

        //   rowData={DATA}
          detailsProps={{
            getTitle: (data: DataType) => data.athlete,
            commentsProps: {
              contentPrefixRenderer: () => 'INTERNAL',
              resolvers: {
                fetch: async (_: any, options: any) => {
                  
                },
                submit: async () => {},
                delete: () => {},
              },
            },
          }}
        />
        </div>
    );
}

export default GridComponent;