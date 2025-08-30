import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { Faca, Pa, ChaveBau } from "./FerramentasEnigma.js";

// Objeto que contém uma pista sobre o baú no jardim
export class BilheteCozinha extends Objeto {
    constructor(){
        super("bilhete_cozinha",
              "Há um bilhete: \"O tesouro que buscas não está dentro da casa. Ele espera por você em frente à guardiã alada, enterrado sob a terra que cobre seus pés.\"",
              "");
    }
    usar(ferramenta){ validate(ferramenta,Ferramenta); return false; }
}

// Objeto que contém uma pista sobre a chave no sofá
export class BilheteArmazem extends Objeto {
    constructor(){
        super("bilhete_armazem",
              "Há um bilhete: \"A chave que abre o caminho do tesouro está bem mais perto do que imaginas. Procure-a onde se repousa o conforto, escondida entre almofadas e tecidos.\"",
              "");
    }
    usar(ferramenta){ validate(ferramenta,Ferramenta); return false; }
}

// Sofá que esconde a chave do baú, precisa da faca para ser aberto
export class Sofa extends Objeto {
    constructor(){
        super("sofa",
              "Um sofá antigo. O estofado parece estranho...",
              "O sofá está rasgado. Havia algo escondido dentro!");
    }
    usar(ferramenta){
        validate(ferramenta,Ferramenta);
        if (ferramenta instanceof Faca){
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

//Objeto que contém uma pista sobre o que fazer com a faca
export class Diario extends Objeto {
    constructor(){
        super("diario",
              "Um diário antigo: \"O que você procura não está visível à primeira vista. Para revelar o segredo escondido, é necessário abrir o tecido com cuidado — às vezes, o caminho exige cortar, separar ou desfiar o que parece seguro.\"",
              "");
    }
    usar(ferramenta){ validate(ferramenta,Ferramenta); return false; }
}

//Objeto para fazer o jogador achar que tem algo aqui
export class Cama extends Objeto {
    constructor(){
        super("cama",
              "Uma cama empoeirada.",
              "Uma cama empoeirada. Nada acontece.");
    }
    usar(ferramenta){
        validate(ferramenta,Ferramenta);
        return false;
    }
}

//Objeto para orientar onde está o baú
export class EstatuaAguia extends Objeto {
    constructor(){
        super("estatua_aguia",
              "Uma estátua de águia sobre um pedestal.",
              "A estátua continua a mesma.");
    }
    usar(ferramenta){
        validate(ferramenta,Ferramenta);
        return false;
    }
}

// Baú que contém o tesouro; precisa ser desenterrado com a pá e aberto com a chave
export class BauTesouro extends Objeto {
    #desenterrado;
    #aberto;
    constructor(){
        super("bau",
              "Você não vê um baú por aqui... talvez esteja enterrado.",
              "Há um baú desenterrado aqui.");
        this.#desenterrado = false;
        this.#aberto = false;
    }
    get desenterrado(){ return this.#desenterrado; }
    get aberto(){ return this.#aberto; }
    usar(ferramenta){
        validate(ferramenta,Ferramenta);
        // desenterrar com pá
        if (ferramenta instanceof Pa && !this.#desenterrado){
            this.#desenterrado = true;
            this.acaoOk = true;
            return true;
        }
        // abrir com chave se desenterrado
        if (ferramenta instanceof ChaveBau && this.#desenterrado && !this.#aberto){
            this.#aberto = true;
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

//Objeto para ilustrar onde esta o baú
export class QuadroAguia extends Objeto {
    constructor(){
        super("quadro",
              "O quadro retrata uma águia dourada, com asas abertas e olhando para baixo, sobre um pedestal coberto de folhas e pedras. Abaixo do pedestal, quase escondido nas sombras da pintura, há um pequeno destaque em relevo na terra.",
              "");
    }
    usar(ferramenta){ validate(ferramenta,Ferramenta); return false; }
}