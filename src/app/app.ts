import '../styles/app.scss'; 
import Chessboard from './Chessboard';
import InputListener from './InputListener';
import Logger from './Logger';

Logger.log("Binding inputs");

const inputEl = document.getElementById("inputEl") as HTMLInputElement;
const retryButton = document.getElementById("retryButton") as HTMLDivElement;
const chessBoardEl = document.getElementById("chessboard") as HTMLDivElement;

const chessBoard = new Chessboard(chessBoardEl);
const inputListener = new InputListener(chessBoard, inputEl, retryButton);
