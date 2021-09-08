// Intersection Observers (IntObs)
// *****************************************************************
//
// IntObs: Change Header Style on Scroll

const header = document.querySelector("header#site__header");
const sectionOne = document.querySelector("#anchor--home");
const faders = document.querySelectorAll(".fade-in");

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

// IntObs: Fade Items into view when scrolling
const appearOptions = {
	threshold: 0,
	rootMargin: "0px 0px 75px 0px"
  };
  
  const appearOnScroll = new IntersectionObserver(function(
	entries,
	appearOnScroll
  ) {
	entries.forEach(entry => {
	  if (!entry.isIntersecting) {
		return;
	  } else {
		entry.target.classList.add("appear");
		appearOnScroll.unobserve(entry.target);
	  }
	});
  },
  appearOptions);
  
  faders.forEach(fader => {
	appearOnScroll.observe(fader);
  });