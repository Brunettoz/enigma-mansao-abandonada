import {validate} from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({sigint: true});
// ---------------------------------------------

// Classe base para todas as ferramentas do jogo (ex: faca, pá, chave)
export class Ferramenta {
	#nome;

	constructor(nome) {
        validate(nome,"String");
		this.#nome = nome;
	}

	get nome() {
		return this.#nome;
	}
	
	usar() {
		return true;
	}
}

// Classe que gerencia o inventário do jogador (mochila com limite de itens)
export class Mochila{
	#ferramentas;
	#limite;

	constructor(){
		this.#ferramentas = [];
		this.#limite = 3; // limite máximo de itens
	}

	guarda(ferramenta){
    validate(ferramenta,Ferramenta);
    if (this.#ferramentas.length >= this.#limite){
        console.log("A mochila está cheia! Não é possível carregar mais itens.");
        return false;
    }
    this.#ferramentas.push(ferramenta);
    return true;
}

	pega(nomeFerramenta){
		validate(arguments,["String"]);
		let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
		return ferramenta;
	}

	tem(nomeFerramenta){
		validate(arguments,["String"]);
		return this.#ferramentas.some(f => f.nome === nomeFerramenta);
	}

	inventario(){
		return this.#ferramentas.map(obj => obj.nome).join(", ");
	}

	remove(nome){
    validate(nome,"String");
    for (let i = 0; i < this.#ferramentas.length; i++){
        if (this.#ferramentas[i].nome === nome){
            this.#ferramentas.splice(i,1);
            return true;
        }
    }
    return false;
	}
}


// Classe base para todos os objetos interativos do jogo (ex: sofá, baú, bilhete)
export class Objeto {
	#nome;
    #descricaoAntesAcao;
    #descricaoDepoisAcao;
    #acaoOk;
    	
	constructor(nome,descricaoAntesAcao, descricaoDepoisAcao) {
		validate(arguments,["String","String","String"]);
		this.#nome = nome;
		this.#descricaoAntesAcao = descricaoAntesAcao;
		this.#descricaoDepoisAcao = descricaoDepoisAcao;
		this.#acaoOk = false;
	}
	
	get nome(){
		return this.#nome;
	}

	get acaoOk() {
		return this.#acaoOk;
	}

	set acaoOk(acaoOk) {
		validate(acaoOk,"Boolean");
		this.#acaoOk = acaoOk;
	}

	get descricao() {
		if (!this.acaoOk) {
			return this.#descricaoAntesAcao;
		}else {
			return this.#descricaoDepoisAcao;
		}
	}

	usa(ferramenta,objeto){
	}
}

// Classe base para todas as salas do jogo, contendo objetos, ferramentas e conexões
export class Sala {
	#nome;
	#objetos;
	#ferramentas;
	#portas;
	#engine;
	
	constructor(nome,engine) {
		validate(arguments,["String",Engine]);
		this.#nome = nome;
		this.#objetos = new Map();
		this.#ferramentas = new Map();
		this.#portas = new Map();
		this.#engine = engine;
	}

	get nome() {
		return this.#nome;
	}
	
	
	get objetos() {
		return this.#objetos;
	}

	get ferramentas() {
		return this.#ferramentas;
	}
	
	get portas(){
		return this.#portas;
	}

	get engine(){
		return this.#engine;
	}
	
	objetosDisponiveis(){
		let arrObjs = [...this.#objetos.values()];
    	return arrObjs.map(obj=>obj.nome+":"+obj.descricao);
	}

	ferramentasDisponiveis(){
		let arrFer = [...this.#ferramentas.values()];
    	return arrFer.map(f=>f.nome);		
	}
	
	portasDisponiveis(){
		let arrPortas = [...this.#portas.values()];
    	return arrPortas.map(sala=>sala.nome);
	}
	
	pega(nomeFerramenta) {
		validate(nomeFerramenta,"String");
		let ferramenta = this.#ferramentas.get(nomeFerramenta);
		if (ferramenta != null) {
			this.#engine.mochila.guarda(ferramenta);
			this.#ferramentas.delete(nomeFerramenta);
			return true;
		}else {
			return false;
		}
	}

	sai(porta) {
		validate(porta,"String");
		return this.#portas.get(porta);
	}

	textoDescricao() {
		let descricao = "Você está no "+this.nome+"\n";
        if (this.objetos.size == 0){
            descricao += "Não há objetos na sala\n";
        }else{
            descricao += "Objetos: "+this.objetosDisponiveis()+"\n";
        }
        if (this.ferramentas.size == 0){
            descricao += "Não há ferramentas na sala\n";
        }else{
            descricao += "Ferramentas: "+this.ferramentasDisponiveis()+"\n";
        }
        descricao += "Portas: "+this.portasDisponiveis()+"\n";
		return descricao;
	}

	usa(ferramenta,objeto){
		return false;
	}
}

// Classe que gerencia o fluxo do jogo (engine principal)
export class Engine{
	#mochila;
	#salaCorrente;
	#fim;

	constructor(){
    this.#mochila = new Mochila();
    this.#salaCorrente = null;
    this.#fim = false;
    this._perdeu = false; // <- flag de derrota
    this.criaCenario();
	}

	get mochila(){
		return this.#mochila;
	}

	get salaCorrente(){
		return this.#salaCorrente;
	}

	set salaCorrente(sala){
		validate(sala,Sala);
		this.#salaCorrente = sala;
	}

	indicaFimDeJogo(){
		this.#fim = true;
	}

	// Para criar um jogo deriva-se uma classe a partir de
	// Engine e se sobrescreve o método "criaCenario"
	criaCenario(){}

	// Para poder acionar o método "joga" deve-se garantir que 
	// o método "criaCenario" foi acionado antes
	joga() {
		let novaSala = null;
		let acao = "";
		let tokens = null;
		while (!this.#fim) {
			console.log("-------------------------");
			console.log(this.salaCorrente.textoDescricao());
			acao = prompt("O que voce deseja fazer? ");
			tokens = acao.split(" ");
			switch (tokens[0]) {
        case "fim":
          this.#fim = true;
          break;
        case "pega":
          if (this.salaCorrente.ferramentas.has(tokens[1])) {
            const item = this.salaCorrente.ferramentas.get(tokens[1]);
            if (this.mochila.guarda(item)) {
              this.salaCorrente.ferramentas.delete(tokens[1]);
              console.log("Você pegou " + tokens[1] + " e guardou na mochila.");
            }
          } else {
            console.log(
              "Não é possível pegar " +
                tokens[1] +
                ". Somente ferramentas podem ser guardadas na mochila."
            );
          }
          break;

        case "inventario":
          console.log(
            "Ferramentas disponiveis para serem usadas: " +
              this.#mochila.inventario()
          );
          break;
        case "usa":
          if (this.salaCorrente.usa(tokens[1], tokens[2])) {
            console.log("Feito !!");
            if (this.#fim == true) {
              if (this._perdeu) {
                console.log(
                  "Você perdeu... a faca quebrou e não há como continuar."
                );
              } else {
                console.log("Parabéns, você venceu!");
              }
            }
          } else {
            console.log(
              "Não é possível usar " +
                tokens[1] +
                " sobre " +
                tokens[2] +
                " nesta sala"
            );
          }
          break;
        case "sai":
          novaSala = this.salaCorrente.sai(tokens[1]);
          if (novaSala == null) {
            console.log("Sala desconhecida ...");
          } else {
            this.#salaCorrente = novaSala;
          }
          break;
        case "descarta":
          if (tokens.length < 2) {
            console.log("Uso: descarta <ferramenta>");
            break;
          }
          const nomeFerramenta = tokens[1];
          if (this.#mochila.tem(nomeFerramenta)) {
            const item = this.#mochila.pega(nomeFerramenta);
            this.#salaCorrente.ferramentas.set(nomeFerramenta, item);
            this.#mochila.remove(nomeFerramenta);
            console.log(
              "Você descartou " +
                nomeFerramenta +
                " e deixou na sala " +
                this.#salaCorrente.nome
            );
          } else {
            console.log("Você não tem " + nomeFerramenta + " na mochila.");
          }
          break;
      }
		}
		console.log("Jogo encerrado!");
	}
}