import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from './lottery';

class App extends React.Component {

   state = {
	   manager : '',
	   players : [],
	   balance : '',
	   value : '',
	   message : '',
   }
   
   async componentDidMount(){
	   const manager = await lottery.methods.manager().call();
	   const players = await lottery.methods.listOfPlayers().call();
	   const balance = await web3.eth.getBalance(lottery.options.address);
	   
	   this.setState({ manager : manager,players : players,balance : balance});
   }
   
   onEnter = async (event) => {
	event.preventDefault();

	const accounts = await web3.eth.getAccounts();
	
	this.setState({ message : 'Waiting on Transaction sucess....' })

	await lottery.methods.enter().send({ 
		from : accounts[0],
		value : web3.utils.toWei(this.state.value, 'ether'),
	});

	this.setState({ message : 'You have been entered!' });
   };

   onPickWinner = async (event) => {
	event.preventDefault();

	const accounts = await web3.eth.getAccounts();

	this.setState({ message : 'Waiting on Transaction sucess....' })

	await lottery.methods.pickWinner().send({ 
		from : accounts[0], 
	});

	this.setState({ message : 'A winner has been picked' });

   }
   
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.<br /> There are currently{" "}
          {this.state.players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>

        <hr />

        <form onSubmit={this.onEnter}>
          <h4>Want to try your luck?</h4>
		  <small>Minimum ether should be greater than 0.01</small>
		  <br />
          <div>
            <label>Amount of ether to enter </label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

		<h4>Ready to Pick a Winner?</h4>
		<small>Only Manager can execute this Transaction</small>
		<br />
		<button onClick={this.onPickWinner}>Pick a Winner</button>
		<hr />
		<h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
