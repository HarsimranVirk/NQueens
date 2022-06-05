import Logger from "./Logger";

class Chessboard {
  public static MAX_SIZE = 9;
  public static MIN_SIZE = 4;

  private size = 4;
  private div: HTMLDivElement | null = null;
  private solutions: string[][] = new Array();
  private mapIndex: Map<number, number> = new Map();

  constructor(attachToDiv: HTMLDivElement) {
    this.div = attachToDiv;
    this.notifySizeChange(4);
  }

  public getSize() {
    return this.size;
  }

  public notifySizeChange(size: number) {
    if (size >= Chessboard.MIN_SIZE && size <= Chessboard.MAX_SIZE) {
      this.size = size;
      Logger.log(`Size ${this.size}`);
      this.solve();
      this.renderChessboard();
    }
  }

  public solve() {
    this.solutions.length = 0;

    const size = this.size

    const pSol: string[] = new Array();

    for (let i = 0; i < size; i++) {
      pSol.push(".".repeat(size));
    } 
    
    this._solve(0, Array.from(pSol));
    this._indexSolution();
  }

  private _solve(row: number, pSol: string[]) {
    if (row === this.size) {
      this.solutions.push(pSol);
      return;
    }

    for (let i = 0; i < this.size; i++) {
      if (this._isValid(row, i, pSol)) {
        const newPSol = Array.from(pSol);
        newPSol[row] =  ".".repeat(i) + 'q' + ".".repeat(this.size - i - 1);
        this._solve(row + 1, newPSol);
      }
    }
  }

  private _isValid(row: number, col: number, pSol: string[]) {
    for (let i = 0; row - i >= 0; i++) {
      if (pSol[i][col] === "q")
        return false;
      if (col-i >= 0 && pSol[row-i][col-i] === "q")
        return false;
        if (col+i < this.size && pSol[row-i][col+i] === "q")
        return false;
    }

    return true;
  }

  private _indexSolution() {
    const size = this.size;
    this.solutions.map((sol, idx) => {
      sol.map((row, rid) => {
        for (let i = 0; i < size; i++)
          if (row[i] === 'q')
            this.mapIndex.set(size * rid + i, idx);
      })
    })
    
  }

  public renderChessboard() {
    if (this.div !== null) {
      const size = this.size;
      this.div.replaceChildren();
      this.div.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
      this.div.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
      for (let row = 0; row < size; row++) {
        for(let col = 0; col < size; col++) {
          const el = document.createElement('div');
          if (this.mapIndex.get(row*size + col)) {
            el.className = 'green cell';
          } else {
            el.className = 'red cell';
          }
          el.addEventListener('click', (ev) => this.cellClickListener(ev, row, col));
          this.div.appendChild(el);
        }
      }
    }
  }
  private cellClickListener(ev: Event, row: number, col: number) {
    const idx = this.mapIndex.get(this.size*row + col);
    if (idx) {
      console.log(this.solutions[idx]);
    }
    
  }
}

export default Chessboard;
