import { CSVLink } from 'react-csv';
import { SalesType } from '../../models/Sales';

interface ExportCSVProps{
    data: SalesType[]
}


const ExportCSV = ({ data } : ExportCSVProps) => {
  const headers = [
    { label: "Réference", key: "idsales" },
    { label: "Description", key: "description" },
    { label: "Taille", key: "taille" },
    { label: "Prix d'achat", key: "prixAchat" },
    { label: "Prix de vente", key: "prixVente" },
    { label: "Bénéfice", key: "benefice" },
    { label: "Etat", key: "etat" },
  ];

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={"sales.csv"}
      className="btn btn-primary"
      target="_blank"
    >
      Export to CSV
    </CSVLink>
  );
};

export default ExportCSV;
