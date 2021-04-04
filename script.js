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

const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -50000,
    date: "23/01/2021",
  },
  {
    id: 2,
    description: "Criação de Website",
    amount: 500000,
    date: "23/01/2021",
  },
  {
    id: 3,
    description: "Internet",
    amount: -20000,
    date: "23/01/2021",
  },
  {
    id: 4,
    description: "Criação de App",
    amount: 200000,
    date: "23/01/2021",
  },
];

const Transaction = {
  all: transactions,

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  incomes() {
    let income = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    
    return income;
  },

  expenses() {
    let expense = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });

    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

const HandleDOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = HandleDOM.innerHTMLTransaction(transaction);

    HandleDOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const cssClass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${cssClass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img src="./assets/minus.svg" alt="Remover Transação" />
      </td>
    `;

    return html;
  },

  updateBalance() {
    document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransactions() {
    HandleDOM.transactionsContainer.innerHTML = '';
  }
};

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    return signal + " " + value;
  },
};

const App = {
  init() {    
    Transaction.all.forEach((transaction) => {
      HandleDOM.addTransaction(transaction);
    });
    
    HandleDOM.updateBalance();
  },

  reload() {
    HandleDOM.clearTransactions();
    App.init();
  },
}

App.init();

Transaction.add({
  id: 5,
  description: 'Aluguel',
  amount: -65000,
  date: '04/04/2021'
});