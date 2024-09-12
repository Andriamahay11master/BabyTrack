import './sales.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SalesType } from '../../models/Sales';
import { formatNumber } from '../../data/function';
        

interface SalesProps {
    dataList: Array<SalesType>
}

export default function Sales({dataList} : SalesProps) {

    // Fonction pour afficher "Vendu" ou "Non vendu" selon la valeur de 'etat'
    const etatBodyTemplate = (rowData: SalesType) => {
        return rowData.etat ? 'Vendu' : 'Non vendu';
    };

    //Fonction pour formater les prix d'achats dans le tableau
    const formatPrixAchat = (rowData: SalesType) => {
        return formatNumber(rowData.prixAchat.toString()) + ' MGA';
    }

    //Fonction pour formater les prix de ventes dans le tableau
    const formatPrixVente = (rowData: SalesType) => {
        return formatNumber(rowData.prixVente.toString()) + ' MGA';
    }

    return (
        <div className='list-block'>
            <DataTable className='list-table' paginator paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        rows={5} rowsPerPageOptions={[5, 10, 25, 50]} stripedRows value={dataList} sortMode="multiple">
                <Column field="idsales" header="Réference" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column field="taille" header="Taille" sortable></Column>
                <Column field="prixAchat" header="PrixAchat" sortable body={formatPrixAchat}></Column>
                <Column field="prixVente" header="PrixVente" sortable body={formatPrixVente}></Column>
                <Column field="etat" header="Etat" sortable body={etatBodyTemplate}></Column>
            </DataTable>
        </div>
    )
}