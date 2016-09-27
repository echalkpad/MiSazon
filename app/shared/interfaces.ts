export interface IReceta {
    key: string;
    fecha: string;
    instrucciones: string;
    ingredientes: string;
    imagen: string;
    descripcion: string;
    titulo: string;
    chef: IChef;
    categoria: string;
    votesUp: number;
    votesDown: number;

}
export interface ICommentario {
    key: string;
    receta_key: string;
    text: string;
    chef: IChef;
    fecha: string;
    votesUp: number;
    votesDown: number;
}
export interface IChef {
    key: string;
    chefname: string;
    avatar: string;
}
export interface Predicate<T> {
    (item: T): boolean;
}