const Modal = {
  // Adiciona a classe active e abre o modal
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  // Remove a classe active e fecha o modal
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const Storage = {
  // Recebe os dados do LocalStorage
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
  },

  // Adiciona os dados no LocalStorage
  set(transaction) {
    localStorage.setItem('dev.finances:transactions',
    JSON.stringify(transaction));
  }
}

const Transaction = {
  // Recebe os dados do LocalStorage
  all: Storage.get(),

  // Adiciona transação
  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  // Remove transação
  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  // Calcula as entradas
  incomes() {
    let income = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    
    return income;
  },

  // Calcula as saídas
  expenses() {
    let expense = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });

    return expense;
  },

  // Calcula o total de entradas e saídas
  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

const HandleDOM = {
  // Seleciona o tbody
  transactionsContainer: document.querySelector("#data-table tbody"),

  // Adiciona o elemento da transação no HTML
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = HandleDOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    HandleDOM.transactionsContainer.appendChild(tr);
  },

  // Cria o elemento da transação
  innerHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${cssClass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação" />
      </td>
    `;

    return html;
  },

  // Atualiza o balanço
  updateBalance() {
    document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
  },

  // Limpa as os elementos de transação do HTML
  clearTransactions() {
    HandleDOM.transactionsContainer.innerHTML = '';
  }
};

const Utils = {
  // Formata a data
  formatDate(date){
    const splittedDate = date.split('-');

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  // Formata o valor que vem do input
  formatAmount(value){
    value = Number(value) * 100;

    return Math.round(value);
  },

  // Formata o valor que será exibido 
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  }
};

const Form = {
  // Seleciona os inputs
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  // Recebe dados dos inputs
  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  // Valida os dados dos inputs
  validateFields(){
    const {description, amount, date} = Form.getValues();

    if (description.trim() === '' || 
        amount.trim() === '' || 
        date.trim() === ''){
          throw new Error('Por favor, preencha todos os campos!');
    }
  },

  // Formata os dados dos inputs
  formatValues(){
    let {description, amount, date} = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date
    }
  },

  // Limpa os inputs
  clearFields(){
    Form.description.value = '';
    Form.amount.value = '';
    Form.date.value = '';
  },

  // Valida e formata os campos, adiciona a transação, limpa os campos e fecha o modal
  submit(event){
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();
      Modal.close();
    } 
    catch (error) {
      alert(error.message);
    }
  }
}

const App = {
  // Inicia adicionando as transações
  init() {    
    Transaction.all.forEach((transaction, index) => {
      HandleDOM.addTransaction(transaction, index); 
    });
    
    HandleDOM.updateBalance();
    Storage.set(Transaction.all);
  },

  // Limpa as transações e adiciona novamente
  reload() {
    HandleDOM.clearTransactions();
    App.init();
  },
}

App.init();
