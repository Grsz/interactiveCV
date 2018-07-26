/*jshint esversion: 6 */
var elements = [],
    ticking = false;

function hivo(elem, x) {
    if (x === undefined) {
        x = elements.length;
    }
    elements[x] = new function () {
        if (elem.length === undefined) {
            elem = [elem];
        }
        this.el = elem;
        this.eT = [];
        this.eH = [];
        this.eB = [];
        this.eC = [];
        (function (th) {
            for (let i = 0, len = th.el.length; i < len; i++) {
                const el = th.el[i];
                const elCont = document.querySelectorAll(".container")[i];
                elCont.style.height = el.offsetHeight + "px";
                th.eT[i] = elCont.offsetTop;
                setTimeout(() => {
                    console.log(th.eT[i], elCont.offsetTop)
                }, 100);
                th.eH[i] = el.offsetHeight;
                th.eB[i] = th.eT[i] + th.eH[i];
                th.eC[i] = th.eT[i] + (th.eH[i] / 2);
            }
        })(this);
    };
}
const sect = document.querySelectorAll("section");
const skills = document.querySelectorAll(".techContainer");
let skillsTop = [...skills].map(skill => skill.getBoundingClientRect().top);
window.onload = function(){
    hivo(sect)
}
window.onresize = function () {
    hivo(sect, 0);
    skillsTop = [...skills].map(skill => skill.getBoundingClientRect().top)
};
window.onscroll = function () {
    let wT = window.pageYOffset,
        wM = window.innerHeight,
        wB = wT + wM,
        wC = wT + (wM / 2);

    if (!ticking) {
        //hivo(sect, 0)
        requestAnimationFrame(effects);
        ticking = true;
    }

    function effects() {
        const x = 0;
        const headerHeight = document.querySelector("header").offsetHeight;
        const menus = document.querySelectorAll(".menu");
        const name = document.querySelector("h2.name");
        const wW = window.innerWidth;
        const opaDec = (wM - wT) / wM;
        const opaDecEnd = 1 - ((wM - headerHeight) / wM);
        elements[x].el[0].style.opacity = opaDec;
        if (opaDec > opaDecEnd){
            const fontColor = Math.round(255 - (opaDec * 255));
            name.classList.remove("fixed");
            name.style.transform = `scale(${0.4 + opaDec * 0.6}) translateY(${(-1-(1-(0.4 + opaDec * 0.6))) * 100}%)`;
            name.style.color = `rgb(${fontColor}, ${fontColor}, ${fontColor})`;
        } else {
            name.classList.add("fixed");
            name.style.transform = `scale(${0.4 + opaDecEnd * 0.6}) translateY(0)`
        }
        const slideIn = () => {
            const scale = document.querySelectorAll(".tech");
            for (let i = 0, len = skills.length; i < len; i++) {
                const e = skills[i],
                    eT = skillsTop[i];
                if (eT < wB) {
                    e.classList.add("slideIn");
                    e.addEventListener("transitionend", function (event) {
                        scale[i].classList.add("grow");
                    }, false);
                } else {
                    e.classList.remove("slideIn");
                }
            }
        };
        slideIn();
        const about = () => {
            const eT = elements[0].eT[3];
            const opa = Math.pow((eT - wT) / wM, 2);
            elements[0].el[2].opacity = eT;
        };
        about();
        for (let i = 1, len = elements[x].el.length; i < len; i++) {
            const e = elements[x].el[i],
                eT = elements[x].eT[i],
                eH = elements[x].eH[i],
                eB = elements[x].eB[i],
                eC = elements[x].eC[i],
                elemCentValt = -Math.abs((wC - eC) / ((eH + wM) / 2)) + 1;

            const introText = document.querySelector(".introText");
            const developer = document.querySelector(".developer");
            const work = document.querySelector(".work");
            const introWrapper = document.querySelector(".introWrapper");

            if (i === 1) {
                if (eC < wB) {
                    !introText.classList.contains("comesIn") &&
                        setTimeout(() => {
                            introText.style.transition = "all 0s";
                        }, 1000);
                    introText.classList.add("comesIn");
                }
                if (eT < wT) {
                    let rotate = ((wT - eT) / (eH / 2) * 3).toFixed(2);
                    let rotatex = (Math.pow(rotate, 1.5)).toFixed(2);
                    rotatex >= 1 ? rotatex = 1 : rotatex;
                    rotatex !== 1 && (introWrapper.style.transform = `translateY(${(wT - eT) / .8}px) rotateX(${rotatex * 90}deg)`)
                    introText.style.opacity = 1 - rotatex;
                    developer.style.opacity = rotatex;
                    rotate >= 1.15 && (
                        developer.style.opacity = (1.9 - rotate) / 0.65,
                        work.style.opacity = 1 - ((2 - rotate) / 0.65)
                    );
                }
            }
            if (eT < wB) {
                menus[i - 1].classList.add("visible");
            }
            if (eT < wB && eB > wT) {
                const fontColor = Math.round(255 - (elemCentValt * 255));
                menus[i - 1].style.color = `rgb(${fontColor}, ${fontColor}, ${fontColor})`;
                menus[i - 1].style.background = `rgba(255, 255, 255, ${elemCentValt.toFixed(2)})`;
            } else {
                menus[i - 1].style.color = "white";
                menus[i - 1].style.background = "none";
            }
            menus[i - 1].onclick = function () {
                (function () {
                    const distance = wT < eT ? eT - wT : wT - eT;
                    if (distance < 100) {
                        scrollTo(0, eT);
                        return;
                    }
                    let speed = Math.round(distance / 30);
                    if (speed >= 20) speed = 20;
                    const step = Math.round(distance / 50);
                    let leapY = eT > wT ? wT + step : wT - step;
                    let timer = 0;
                    if (eT > wT) {
                        for (let i = wT; i < eT; i += step) {
                            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                            leapY += step;
                            if (leapY > eT) leapY = eT;
                            timer++;
                        }
                        return;
                    }
                    for (let i = wT; i > eT; i -= step) {
                        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                        leapY -= step;
                        if (leapY < eT) leapY = eT;
                        timer++;
                    }
                })();
            };

            var bend, bendX, cont = document.querySelectorAll("div.container")[i];
            if (eH > wM) {
                bend = (eT - wT) / wM;
            } else {
                bend = (eB - wB) / eH;
            }
            if (bend <= 0) {
                bend = 0;
            }
            if (bend >= 1) {
                bend = 1;
            }
            bendX = Math.pow(bend, 2);
            if (i < 3) {
                if (bend < 1 && bend > 0) {
                    e.style.willChange = "transform";
                    e.style.transform = "rotateX(" + bendX * 90 + "deg)";
                    cont.style.perspective = "100vh";
                    cont.style.perspectiveOrigin = "50% 0%";
                    cont.style.overflow = "hidden";

                } else {
                    e.style.willChange = "auto";
                    e.style.transform = "none";
                    cont.style.perspective = "none";
                }
                e.style.transformOrigin = "top";
                i === 2 ? e.style.opacity = -Math.abs((wC - eC) / (wM / 2)) + 1 + eH / wM : e.style.opacity = 1 - bend;

                if (i > 0) {
                    if (eH < wM) {
                        if (wT >= eT) {
                            e.style.position = "fixed";
                            e.style.top = 0;
                        } else {
                            e.style.position = "relative";
                        }
                    } else {
                        if (wB >= eB) {
                            e.style.position = "fixed";
                            e.style.bottom = 0;
                        } else {
                            e.style.position = "relative";
                        }
                    }
                }
            } else if (i === 3) {
                const iLetter = document.querySelector(".i");
                const benefits = document.querySelectorAll("li");
                const benefitsWrapper = document.querySelector(".benefitWrapper");
                const bigBenefits = document.querySelectorAll(".can, .will, .wantto, .do, .learn, .anything");
                let iTransform = Math.pow(((eT + 1.5 * wM - wT) / wM), 2);

                iTransform <= 0 ? iTransform = 0 : iTransform;
                eT < wT ? iLetter.classList.add("iTransform") : iLetter.classList.remove("iTransform");
                if (eT + wM / 2 < wT && wT <= eT + 1.5 * wM) {
                    iLetter.style.transform = `translate(${-50 - ((1 - iTransform) * 150)}%, -50%) scale(${0.28 + iTransform * 0.72})`;
                    benefitsWrapper.style.opacity = 0.8 - iTransform;
                    benefits.forEach(benefit => {
                        benefit.style.opacity = iTransform;
                    });
                } else if (wT > eT + wM) {
                    bigBenefits.forEach(benefit => {
                        benefit.style.animationPlayState = "running";
                        benefit.style.WebkitAnimationPlayState = "running";
                    });
                    e.style.opacity = (eB - wB) / (wM / 2)
                }
            }
        }
        ticking = false;
    }
};