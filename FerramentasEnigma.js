import { Ferramenta } from "./Basicas.js";

// Ferramenta cortante usada para abrir o sofá
export class Faca extends Ferramenta {
    constructor(){
        super("faca");
    }
}

// Ferramenta usada para cavar e desenterrar o baú
export class Pa extends Ferramenta {
    constructor(){
        super("pa");
    }
}

// Ferramenta usada para abrir o baú após desenterrado
export class ChaveBau extends Ferramenta {
    constructor(){
        super("chave");
    }
}

// Ferramenta usada para iluminar (não essencial para o enigma principal)
export class Lanterna extends Ferramenta {
    constructor(){
        super("lanterna");
    }
}