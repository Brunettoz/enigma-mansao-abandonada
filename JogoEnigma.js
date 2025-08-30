import { Engine } from "./Basicas.js";
import { Cozinha, Armazem, SalaDeEstar, QuartoAntigo, JardimMansao, CorredorPrincipal } from "./SalasEnigma.js";

// JogoEnigma: implementação do Engine com todas as salas e conexões do enigma
export class JogoEnigma extends Engine {
    constructor(){
        super();
        // flag de faca quebrada
        this._facaQuebrada = false;
    }

    criaCenario(){
        const corredor = new CorredorPrincipal(this);
        const sala = new SalaDeEstar(this);
        const cozinha = new Cozinha(this);
        const quarto = new QuartoAntigo(this);
        const armazem = new Armazem(this);
        const jardim = new JardimMansao(this);

        // Conexões: Sala de estar
        sala.portas.set(jardim.nome, jardim);
        sala.portas.set(cozinha.nome, cozinha);
        sala.portas.set(corredor.nome, corredor);
        sala.portas.set(armazem.nome, armazem);
        
        // Conexões: Cozinha
        cozinha.portas.set(sala.nome, sala);

        // Conexões: Armazem
        armazem.portas.set(sala.nome, sala);

        // Conexões: Jardim
        jardim.portas.set(sala.nome, sala);

        // Conexões: Corredor
        corredor.portas.set(quarto.nome, quarto);
        corredor.portas.set(sala.nome, sala);

        // Conexões: Quarto
        quarto.portas.set(corredor.nome, corredor);
        
        

        this.salaCorrente = jardim;
    }
}