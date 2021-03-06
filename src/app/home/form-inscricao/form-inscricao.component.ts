import {Component, OnInit, EventEmitter} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';

import {FirebaseService} from "../../shared/firebase.service";
import {Subscription} from "../../shared/data/subscription";
import {Question} from "../../shared/data/question";
import {_catch} from "rxjs/operator/catch";

@Component({
    selector: 'app-form-inscricao',
    templateUrl: './form-inscricao.component.html',
    styleUrls: ['./form-inscricao.component.scss']
})
export class FormInscricaoComponent implements OnInit {

    subscription: Subscription = new Subscription();
    alertActions = new EventEmitter<string|MaterializeAction>();
    surveyActions = new EventEmitter<string|MaterializeAction>();

    alertMsg: string;
    multipla: Array<any>;
    step: number = 1;

    constructor(private fire: FirebaseService) { }

    ngOnInit() {
        /*this.subscription.name = 'walter';
        this.subscription.email = 't@c.co';*/
    }

    sendSubscription(): void {
        if (this.subscription.name && this.subscription.email) {

            if (this.validateEmail()) {

                if (this.fire.verifySubscription(this.subscription)) {
                    this.startSurvey();
                } else {
                    this.alertMsg = 'Você já está inscrito!';
                    this.alertActions.emit({ action:"modal", params:['open'] });
                }

            } else {
                this.alertMsg = 'Digite um e-mail válido!';
                this.alertActions.emit({ action:"modal", params:['open'] });
            }

        } else {
            this.alertMsg = 'Preencha seu nome e e-mail!';
            this.alertActions.emit({ action:"modal", params:['open'] });
        }

    }

    private startSurvey(): void {
        this.surveyActions.emit({ action:"modal", params:['open'] });
    }

    private validateEmail(): boolean {
        let reg = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        return reg.test(this.subscription.email);
    }

    resposta(pergunta: string, resposta: string, step: number): void {
        let q = new Question();
        q.question = pergunta;
        q.answer = resposta;

        this.subscription.survey.questions.push(q);
        this.avancaStep(step);
    }

    respostaMultipla(resposta: string): void {
        this.multipla.push(resposta);
    }

    private avancaStep(step: number): void {

        this.step = step;

        if (step == 4)
            this.multipla = new Array<any>();
    }

    finalizar(): void {
        this.avancaStep(8);

        this.fire.subscribeToEvent(this.subscription)
            .then( res => {
                this.avancaStep(9);
                this.sendEmail(res.key);
            } )
            .catch( err => console.log(err) );
    }

    private sendEmail(key: string): void {

    }

}
