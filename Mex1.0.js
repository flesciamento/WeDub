function Mex(ID, Stringa, Colore) {
	var M = document.getElementById(ID);
	M.innerHTML = Stringa;
	M.style.color = (Colore? Colore : "");
}
