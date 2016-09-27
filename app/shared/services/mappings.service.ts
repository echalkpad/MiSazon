import { Injectable } from '@angular/core';

import { IReceta, ICommentario } from '../interfaces';
import { ItemsService } from '../services/items.service';

@Injectable()
export class MappingsService {

    constructor(private itemsService: ItemsService) { }

    getThreads(snapshot: any): Array<IReceta> {
        let threads: Array<IReceta> = [];
        if (snapshot.val() == null)
            return threads;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let thread: any = list[key];
            threads.push({

                key: key,
                fecha: thread.fecha,
                instrucciones: thread.instrucciones,
                ingredientes: thread.ingredientes,
                titulo: thread.titulo,
                imagen: thread.imagen,
                descripcion: thread.descripcion,
                chef: thread.chef,
                categoria: thread.categoria,
                votesUp: thread.votesUp,
                votesDown: thread.votesDown

            });
        });

        return threads;
    }

    getThread(snapshot: any, key: string): IReceta {

        let thread: IReceta = {
            key: key,
            fecha: snapshot.fecha,
            instrucciones: snapshot.instrucciones,
            ingredientes: snapshot.ingredientes,
            titulo: snapshot.titulo,
            imagen: snapshot.imagen,
            descripcion: snapshot.descripcion,
            chef: snapshot.chef,
            categoria: snapshot.categoria,
            votesUp: snapshot.votesUp,
            votesDown: snapshot.votesDown
        };

        return thread;
    }

    getComments(snapshot: any): Array<ICommentario> {
        let comments: Array<ICommentario> = [];
        if (snapshot.val() == null)
            return comments;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let comment: any = list[key];
            //console.log(comment.votes);
            this.itemsService.groupByBoolean(comment.votes, true);

            comments.push({
                key: key,
                receta_key: comment.receta_key,
                text: comment.text,
                chef: comment.chef,
                fecha: comment.fecha,
                votesUp: this.itemsService.groupByBoolean(comment.votes, true),
                votesDown: this.itemsService.groupByBoolean(comment.votes, false)


            });
        });

        return comments;
    }

    getComment(snapshot: any, commentKey: string): ICommentario {
        let comment: ICommentario;

        if (snapshot.val() == null)
            return null;

        let snapshotComment = snapshot.val();
        console.log(snapshotComment);
        comment = {
            key: commentKey,
            receta_key: snapshotComment.receta_key,
            text: snapshotComment.text,
            chef: snapshotComment.chef,
            fecha: snapshotComment.fecha,
            votesUp: this.itemsService.groupByBoolean(snapshotComment.votes, true),
            votesDown: this.itemsService.groupByBoolean(snapshotComment.votes, false)
        };

        return comment;
    }

}