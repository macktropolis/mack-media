// Intersection Observers (IntObs)
// *****************************************************************
//
// IntObs: Change Header Style on Scroll

const header = document.querySelector("header#site__header");
const sectionOne = document.querySelector("#anchor--home");

const sectionOneOptions = {
	rootMargin: "20px 0px 0px 0px"
};

const sectionOneObserver = new IntersectionObserver 
(function(
	entries, 
	sectionOneObserver
) {
	entries.forEach(entry => {
		if(!entry.isIntersecting) {
			header.classList.add("scrolled");
		} else {
			header.classList.remove("scrolled");
		}
		console.log(entry.target);
	});
}, 
sectionOneOptions);

sectionOneObserver.observe(sectionOne);