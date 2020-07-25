function charCount(){
	var count = document.getElementById("shortLink").value.length;
	var count2 = document.getElementById("originalURL").value.length;
	var re = /^[a-z0-9]{0,10}$/;
	document.getElementById("charCounter").innerHTML = count;
	if(count2<1 || re.test(document.getElementById("shortLink").value)==false || document.getElementById("shortLink").value == "success" || document.getElementById("shortLink").value == "error" || document.getElementById("shortLink").value == "favicon"){
		document.getElementById("generateLink").setAttribute("disabled", "disabled");
	}else if (count2 >=1 && re.test(document.getElementById("shortLink").value)==true){
		document.getElementById("generateLink").removeAttribute("disabled");
	}
}

