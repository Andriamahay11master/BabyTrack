import './sales.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        

interface SalesProps {
    dataList: any
}

export default function Sales({dataList} : SalesProps) {

    return (
        <div className='list-block'>
            <DataTable className='list-table' paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} stripedRows value={dataList} sortMode="multiple">
                <Column field="idsales" header="Réference" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column field="Taille" header="Taille" sortable></Column>
                <Column field="Prix" header="Prix" sortable></Column>
                <Column field="Etat" header="Etat" sortable></Column>
            </DataTable>
        </div>
    )
}