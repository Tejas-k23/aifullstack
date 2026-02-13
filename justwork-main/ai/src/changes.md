we implimented a 
.noise-overlay {
  position: fixed;
  inset: -50%; 
  width: 200%;
  height: 200%;
  pointer-events: none;
  z-index: 10;
  background-image: url('/transperent.png');
  background-repeat: repeat;
  background-size: 250px 250px;
  mix-blend-mode: overlay;
  
  /* CHANGE THESE THREE LINES */
  opacity: 0.9; 
  animation: grain 2s steps(1) infinite;
  will-change: transform;
}

/* @keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1%, -1%); }
  20% { transform: translate(-2%, 1%); }
  30% { transform: translate(1%, -2%); }
  40% { transform: translate(-1%, 2%); }
  50% { transform: translate(-2%, 1%); }
  60% { transform: translate(2%, 0%); }
  70% { transform: translate(0%, 2%); }
  80% { transform: translate(1%, 2%); }
  90% { transform: translate(-1%, 1%); }
} */
img,
.phone-mockup,
.phone-mockup-container,
.iphone-mockup,
.iphone-frame,
.iphone-screen,
.slider-container,
.diagram-background,
.compare-card,
.feature-image,
.image-container {
  position: relative;
  z-index: 20;
  isolation: isolate;
}

in this i want to remove graine frome some div they are
 img,
.phone-mockup,
.phone-mockup-container,
.iphone-mockup,
.iphone-frame,
.iphone-screen,
.slider-container,
.diagram-background,
.compare-card,
.feature-image,
.image-container,
we apply it but now working are phone-mockup,
.phone-mockup-container,
.iphone-mockup,
.iphone-frame,
.iphone-screen, check why other are not working do the changes required and create a md file in brief tell me why is phone-mockup,
.phone-mockup-container,
.iphone-mockup,
.iphone-frame,
.iphone-screen, working and why other not and what to do if after your changes it not work i think there is z index issue . this is your 1st task. 

//as a second task in diagram-background i try to impliment that svg stroke i want a 5 line of strokeline coming from  icon-row icon-row-bottom to hub-icon impliment it.

also i want that create a similre diagram-background at top icon-row icon-row-top icon-row icon-row-bottom same aftere that in centre i can add a video of that svg animatione and at bottome centr hub icone//