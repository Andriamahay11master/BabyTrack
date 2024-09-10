export type SalesType = {
    idsales: string,
    description: string,
    taille: string,
    prixAchat: number,
    prixVente: number,
    benefice?: number,
    etat: boolean | string
}