import { validate } from "bycontract";
import { Sala, Engine } from "./Basicas.js";
import { Faca, Pa, ChaveBau, Lanterna } from "./FerramentasEnigma.js";
import { Sofa, Diario, Cama, EstatuaAguia, BauTesouro, QuadroAguia, BilheteCozinha, BilheteArmazem } from "./ObjetosEnigma.js";

// Sala Cozinha: contém um bilhete com pistas e a faca
export class Cozinha extends Sala {
    constructor(engine){
        validate(engine,Engine);
        super("Cozinha", engine);
        // Ferramentas e objetos
        this.ferramentas.set("faca", new Faca());
        this.objetos.set("bilhete_cozinha", new BilheteCozinha());
    }
    usa(ferramenta,objeto){
        validate(arguments,["String","String"]);
        if (ferramenta === "faca" && objeto !== "sofa"){
            console.log("Você usou a faca de forma errada... ela quebrou!");
            this.engine._perdeu = true;   // nova flag
            this.engine.indicaFimDeJogo();
            return false;
        }
        return false;
    }
}

// Sala Armazém: contém a pá e um bilhete
export class Armazem extends Sala {
    constructor(engine){
        validate(engine,Engine);
        super("Armazem", engine);
        this.ferramentas.set("pa", new Pa());
        this.objetos.set("bilhete_armazem", new BilheteArmazem());
    }
    usa(ferramenta,objeto){
        validate(arguments,["String","String"]);
        if (ferramenta === "faca" && objeto !== "sofa"){
            console.log("Você usou a faca de forma errada... ela quebrou!");
            this.engine._perdeu = true;   // nova flag
            this.engine.indicaFimDeJogo();
            return false;
        }
        return false;
    }
}

// Sala de Estar: contém o sofá (esconde a chave do baú) e a lanterna
export class SalaDeEstar extends Sala {
    constructor(engine){
        validate(engine,Engine);
        super("Sala_de_Estar", engine);
        this.objetos.set("sofa", new Sofa());
        this.ferramentas.set("lanterna", new Lanterna());
    }
    usa(ferramenta,objeto){
        validate(arguments,["String","String"]);
        // regra da faca quebrar se usar em objeto errado
        if (ferramenta === "faca" && objeto !== "sofa"){
            console.log("Você usou a faca de forma errada... ela quebrou!");
            this.engine._perdeu = true;   // nova flag
            this.engine.indicaFimDeJogo();
            return false;
        }
        if (!this.engine.mochila.tem(ferramenta)) return false;
        if (!this.objetos.has(objeto)) return false;
        const alvo = this.objetos.get(objeto);
        const ok = alvo.usar(this.engine.mochila.pega(ferramenta));
        if (alvo instanceof Sofa && ok){
            // revela a chave do baú na sala
            this.ferramentas.set("chave", new ChaveBau());
        }
        return ok;
    }
}

// Quarto Antigo: contém o diário e a cama
export class QuartoAntigo extends Sala {
    constructor(engine){
        validate(engine,Engine);
        super("Quarto_Antigo", engine);
        this.objetos.set("diario", new Diario());
        this.objetos.set("cama", new Cama());
    }
    usa(ferramenta,objeto){
        validate(arguments,["String","String"]);
        if (ferramenta === "faca" && objeto !== "sofa"){
            console.log("Você usou a faca de forma errada... ela quebrou!");
            this.engine._perdeu = true;   // nova flag
            this.engine.indicaFimDeJogo();
            return false;
        }
        return false;
    }
}

// Corredor Principal: contém o quadro da águia
export class CorredorPrincipal extends Sala {
    constructor(engine){
        validate(engine,Engine);
        super("Corredor_Principal", engine);
        this.objetos.set("quadro", new QuadroAguia());
    }
    usa(ferramenta,objeto){
        validate(arguments,["String","String"]);
        if (ferramenta === "faca" && objeto !== "sofa"){
            console.log("Você usou a faca de forma errada... ela quebrou!");
            this.engine._perdeu = true;   // nova flag
            this.engine.indicaFimDeJogo();
            return false;
        }
        return false;
    }
}

// Jardim da Mansão: contém a estátua da águia e o baú do tesouro
export class JardimMansao extends Sala {
    constructor(engine){
        validate(engine,Engine);
        super("Jardim", engine);
        this.objetos.set("estatua_aguia", new EstatuaAguia());
        this.objetos.set("bau", new BauTesouro());
    }
    usa(ferramenta,objeto){
        validate(arguments,["String","String"]);
        if (ferramenta === "faca" && objeto !== "sofa"){
            console.log("Você usou a faca de forma errada... ela quebrou!");
            this.engine._perdeu = true;   // nova flag
            this.engine.indicaFimDeJogo();
            return false;
        }
        if (this.engine._facaQuebrada && ferramenta === "faca"){
            return false;
        }
        if (!this.engine.mochila.tem(ferramenta)) return false;
        if (!this.objetos.has(objeto)) return false;
        const alvo = this.objetos.get(objeto);
        const ok = alvo.usar(this.engine.mochila.pega(ferramenta));
        if (alvo instanceof BauTesouro && ok){
            // Se abriu o baú, termina o jogo
            if (alvo.aberto){
                this.engine.indicaFimDeJogo();
            }
        }
        return ok;
    }
}