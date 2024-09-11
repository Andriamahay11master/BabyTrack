export type SalesType = {
    idsales: string,
    description: string,
    taille: string,
    prixAchat: number,
    prixVente: number,
    dateA?: string,
    dateV?: string,
    benefice?: number,
    etat: boolean | string
}