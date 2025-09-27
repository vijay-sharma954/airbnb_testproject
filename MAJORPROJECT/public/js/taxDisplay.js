let taxToogle = document.getElementById("flexSwitchCheckDefault");
    let taxInfo = document.getElementsByClassName("tax-info");

    taxToogle.addEventListener("click", () => {
      for (tax of taxInfo) {
        if (tax.style.display != "inline") {
          tax.style.display = "inline";
        } else {
          tax.style.display = "none";
        }
      }
    });