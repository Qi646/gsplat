var su=Object.defineProperty;var ru=(s,e,t)=>e in s?su(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var Z=(s,e,t)=>ru(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ro="169",mi={ROTATE:0,DOLLY:1,PAN:2},gi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},au=0,Ho=1,ou=2,hc=1,lu=2,bn=3,An=0,Gt=1,tn=2,Xn=0,qn=1,Vo=2,Go=3,Wo=4,fc=5,si=100,cu=101,uu=102,du=103,hu=104,fu=200,pu=201,mu=202,gu=203,ps=204,ms=205,Au=206,Su=207,xu=208,vu=209,_u=210,yu=211,Mu=212,Cu=213,Eu=214,pa=0,ma=1,ga=2,Gi=3,Aa=4,Sa=5,xa=6,va=7,pc=0,Tu=1,bu=2,Qn=0,wu=1,Ru=2,Iu=3,Pu=4,Du=5,Fu=6,Lu=7,mc=300,Wi=301,Xi=302,_a=303,ya=304,Sr=306,Ma=1e3,li=1001,Ca=1002,Vt=1003,Bu=1004,Cs=1005,dn=1006,Rr=1007,ci=1008,Sn=1009,gc=1010,Ac=1011,gs=1012,ao=1013,nn=1014,fn=1015,Zi=1016,oo=1017,lo=1018,qi=1020,Sc=35902,xc=1021,vc=1022,Ot=1023,_c=1024,yc=1025,di=1026,Qi=1027,Mc=1028,xr=1029,Cc=1030,co=1031,Ni=1033,er=33776,tr=33777,nr=33778,ir=33779,Ea=35840,Ta=35841,ba=35842,wa=35843,Ra=36196,Ia=37492,Pa=37496,Da=37808,Fa=37809,La=37810,Ba=37811,Ua=37812,Oa=37813,Na=37814,za=37815,ka=37816,Ha=37817,Va=37818,Ga=37819,Wa=37820,Xa=37821,sr=36492,qa=36494,Qa=36495,Ec=36283,Ya=36284,Ka=36285,ja=36286,Uu=3200,Ou=3201,Nu=0,zu=1,Wn="",pn="srgb",Kn="srgb-linear",uo="display-p3",vr="display-p3-linear",or="linear",lt="srgb",lr="rec709",cr="p3",Ai=7680,Xo=519,ku=512,Hu=513,Vu=514,Tc=515,Gu=516,Wu=517,Xu=518,qu=519,qo=35044,Qu=35048,Qo="300 es",Pn=2e3,ur=2001;class fi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Yo=1234567;const os=Math.PI/180,As=180/Math.PI;function $i(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[s&255]+Dt[s>>8&255]+Dt[s>>16&255]+Dt[s>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function Pt(s,e,t){return Math.max(e,Math.min(t,s))}function ho(s,e){return(s%e+e)%e}function Yu(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Ku(s,e,t){return s!==e?(t-s)/(e-s):0}function ls(s,e,t){return(1-t)*s+t*e}function ju(s,e,t,n){return ls(s,e,1-Math.exp(-t*n))}function Zu(s,e=1){return e-Math.abs(ho(s,e*2)-e)}function $u(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Ju(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function ed(s,e){return s+Math.floor(Math.random()*(e-s+1))}function td(s,e){return s+Math.random()*(e-s)}function nd(s){return s*(.5-Math.random())}function id(s){s!==void 0&&(Yo=s);let e=Yo+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function sd(s){return s*os}function rd(s){return s*As}function ad(s){return(s&s-1)===0&&s!==0}function od(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function ld(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function cd(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),d=r((e-n)/2),p=a((e-n)/2),h=r((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":s.set(o*u,l*d,l*p,o*c);break;case"YZY":s.set(l*p,o*u,l*d,o*c);break;case"ZXZ":s.set(l*d,l*p,o*u,o*c);break;case"XZX":s.set(o*u,l*g,l*h,o*c);break;case"YXY":s.set(l*h,o*u,l*g,o*c);break;case"ZYZ":s.set(l*g,l*h,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Li(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Lt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const fo={DEG2RAD:os,RAD2DEG:As,generateUUID:$i,clamp:Pt,euclideanModulo:ho,mapLinear:Yu,inverseLerp:Ku,lerp:ls,damp:ju,pingpong:Zu,smoothstep:$u,smootherstep:Ju,randInt:ed,randFloat:td,randFloatSpread:nd,seededRandom:id,degToRad:sd,radToDeg:rd,isPowerOfTwo:ad,ceilPowerOfTwo:od,floorPowerOfTwo:ld,setQuaternionFromProperEuler:cd,normalize:Lt,denormalize:Li};class Me{constructor(e=0,t=0){Me.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Pt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ze{constructor(e,t,n,i,r,a,o,l,c){ze.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],p=n[2],h=n[5],g=n[8],A=i[0],f=i[3],m=i[6],x=i[1],v=i[4],y=i[7],T=i[2],E=i[5],_=i[8];return r[0]=a*A+o*x+l*T,r[3]=a*f+o*v+l*E,r[6]=a*m+o*y+l*_,r[1]=c*A+u*x+d*T,r[4]=c*f+u*v+d*E,r[7]=c*m+u*y+d*_,r[2]=p*A+h*x+g*T,r[5]=p*f+h*v+g*E,r[8]=p*m+h*y+g*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,p=o*l-u*r,h=c*r-a*l,g=t*d+n*p+i*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const A=1/g;return e[0]=d*A,e[1]=(i*c-u*n)*A,e[2]=(o*n-i*a)*A,e[3]=p*A,e[4]=(u*t-i*l)*A,e[5]=(i*r-o*t)*A,e[6]=h*A,e[7]=(n*l-c*t)*A,e[8]=(a*t-n*r)*A,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ir.makeScale(e,t)),this}rotate(e){return this.premultiply(Ir.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ir.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ir=new ze;function bc(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function dr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ud(){const s=dr("canvas");return s.style.display="block",s}const Ko={};function rr(s){s in Ko||(Ko[s]=!0,console.warn(s))}function dd(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function hd(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function fd(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const jo=new ze().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Zo=new ze().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ts={[Kn]:{transfer:or,primaries:lr,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s,fromReference:s=>s},[pn]:{transfer:lt,primaries:lr,luminanceCoefficients:[.2126,.7152,.0722],toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[vr]:{transfer:or,primaries:cr,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.applyMatrix3(Zo),fromReference:s=>s.applyMatrix3(jo)},[uo]:{transfer:lt,primaries:cr,luminanceCoefficients:[.2289,.6917,.0793],toReference:s=>s.convertSRGBToLinear().applyMatrix3(Zo),fromReference:s=>s.applyMatrix3(jo).convertLinearToSRGB()}},pd=new Set([Kn,vr]),nt={enabled:!0,_workingColorSpace:Kn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!pd.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=ts[e].toReference,i=ts[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return ts[s].primaries},getTransfer:function(s){return s===Wn?or:ts[s].transfer},getLuminanceCoefficients:function(s,e=this._workingColorSpace){return s.fromArray(ts[e].luminanceCoefficients)}};function zi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Pr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Si;class md{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Si===void 0&&(Si=dr("canvas")),Si.width=e.width,Si.height=e.height;const n=Si.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Si}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=dr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=zi(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(zi(t[n]/255)*255):t[n]=zi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let gd=0;class wc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gd++}),this.uuid=$i(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Dr(i[a].image)):r.push(Dr(i[a]))}else r=Dr(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Dr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?md.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ad=0;class Nt extends fi{constructor(e=Nt.DEFAULT_IMAGE,t=Nt.DEFAULT_MAPPING,n=li,i=li,r=dn,a=ci,o=Ot,l=Sn,c=Nt.DEFAULT_ANISOTROPY,u=Wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ad++}),this.uuid=$i(),this.name="",this.source=new wc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Me(0,0),this.repeat=new Me(1,1),this.center=new Me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ma:e.x=e.x-Math.floor(e.x);break;case li:e.x=e.x<0?0:1;break;case Ca:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ma:e.y=e.y-Math.floor(e.y);break;case li:e.y=e.y<0?0:1;break;case Ca:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=mc;Nt.DEFAULT_ANISOTROPY=1;class ft{constructor(e=0,t=0,n=0,i=1){ft.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],u=l[4],d=l[8],p=l[1],h=l[5],g=l[9],A=l[2],f=l[6],m=l[10];if(Math.abs(u-p)<.01&&Math.abs(d-A)<.01&&Math.abs(g-f)<.01){if(Math.abs(u+p)<.1&&Math.abs(d+A)<.1&&Math.abs(g+f)<.1&&Math.abs(c+h+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,y=(h+1)/2,T=(m+1)/2,E=(u+p)/4,_=(d+A)/4,w=(g+f)/4;return v>y&&v>T?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=E/n,r=_/n):y>T?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=E/i,r=w/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=_/r,i=w/r),this.set(n,i,r,t),this}let x=Math.sqrt((f-g)*(f-g)+(d-A)*(d-A)+(p-u)*(p-u));return Math.abs(x)<.001&&(x=1),this.x=(f-g)/x,this.y=(d-A)/x,this.z=(p-u)/x,this.w=Math.acos((c+h+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Sd extends fi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Nt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new wc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Yn extends Sd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Rc extends Nt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class xd extends Nt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ut{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],d=n[i+3];const p=r[a+0],h=r[a+1],g=r[a+2],A=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(o===1){e[t+0]=p,e[t+1]=h,e[t+2]=g,e[t+3]=A;return}if(d!==A||l!==p||c!==h||u!==g){let f=1-o;const m=l*p+c*h+u*g+d*A,x=m>=0?1:-1,v=1-m*m;if(v>Number.EPSILON){const T=Math.sqrt(v),E=Math.atan2(T,m*x);f=Math.sin(f*E)/T,o=Math.sin(o*E)/T}const y=o*x;if(l=l*f+p*y,c=c*f+h*y,u=u*f+g*y,d=d*f+A*y,f===1-o){const T=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=T,c*=T,u*=T,d*=T}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],d=r[a],p=r[a+1],h=r[a+2],g=r[a+3];return e[t]=o*g+u*d+l*h-c*p,e[t+1]=l*g+u*p+c*d-o*h,e[t+2]=c*g+u*h+o*p-l*d,e[t+3]=u*g-o*d-l*p-c*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),d=o(r/2),p=l(n/2),h=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=p*u*d+c*h*g,this._y=c*h*d-p*u*g,this._z=c*u*g+p*h*d,this._w=c*u*d-p*h*g;break;case"YXZ":this._x=p*u*d+c*h*g,this._y=c*h*d-p*u*g,this._z=c*u*g-p*h*d,this._w=c*u*d+p*h*g;break;case"ZXY":this._x=p*u*d-c*h*g,this._y=c*h*d+p*u*g,this._z=c*u*g+p*h*d,this._w=c*u*d-p*h*g;break;case"ZYX":this._x=p*u*d-c*h*g,this._y=c*h*d+p*u*g,this._z=c*u*g-p*h*d,this._w=c*u*d+p*h*g;break;case"YZX":this._x=p*u*d+c*h*g,this._y=c*h*d+p*u*g,this._z=c*u*g-p*h*d,this._w=c*u*d-p*h*g;break;case"XZY":this._x=p*u*d-c*h*g,this._y=c*h*d-p*u*g,this._z=c*u*g+p*h*d,this._w=c*u*d+p*h*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],p=n+o+d;if(p>0){const h=.5/Math.sqrt(p+1);this._w=.25/h,this._x=(u-l)*h,this._y=(r-c)*h,this._z=(a-i)*h}else if(n>o&&n>d){const h=2*Math.sqrt(1+n-o-d);this._w=(u-l)/h,this._x=.25*h,this._y=(i+a)/h,this._z=(r+c)/h}else if(o>d){const h=2*Math.sqrt(1+o-n-d);this._w=(r-c)/h,this._x=(i+a)/h,this._y=.25*h,this._z=(l+u)/h}else{const h=2*Math.sqrt(1+d-n-o);this._w=(a-i)/h,this._x=(r+c)/h,this._y=(l+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-r*l,this._y=i*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const h=1-t;return this._w=h*a+t*this._w,this._x=h*n+t*this._x,this._y=h*i+t*this._y,this._z=h*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),d=Math.sin((1-t)*u)/c,p=Math.sin(t*u)/c;return this._w=a*d+this._w*p,this._x=n*d+this._x*p,this._y=i*d+this._y*p,this._z=r*d+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion($o.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion($o.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),u=2*(o*t-r*i),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-r*d,this.z=i+l*d+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Fr.copy(this).projectOnVector(e),this.sub(Fr)}reflect(e){return this.sub(Fr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Pt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Fr=new I,$o=new ut;class sn{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ln):ln.fromBufferAttribute(r,a),ln.applyMatrix4(e.matrixWorld),this.expandByPoint(ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Es.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Es.copy(n.boundingBox)),Es.applyMatrix4(e.matrixWorld),this.union(Es)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ln),ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ns),Ts.subVectors(this.max,ns),xi.subVectors(e.a,ns),vi.subVectors(e.b,ns),_i.subVectors(e.c,ns),Ln.subVectors(vi,xi),Bn.subVectors(_i,vi),Zn.subVectors(xi,_i);let t=[0,-Ln.z,Ln.y,0,-Bn.z,Bn.y,0,-Zn.z,Zn.y,Ln.z,0,-Ln.x,Bn.z,0,-Bn.x,Zn.z,0,-Zn.x,-Ln.y,Ln.x,0,-Bn.y,Bn.x,0,-Zn.y,Zn.x,0];return!Lr(t,xi,vi,_i,Ts)||(t=[1,0,0,0,1,0,0,0,1],!Lr(t,xi,vi,_i,Ts))?!1:(bs.crossVectors(Ln,Bn),t=[bs.x,bs.y,bs.z],Lr(t,xi,vi,_i,Ts))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const _n=[new I,new I,new I,new I,new I,new I,new I,new I],ln=new I,Es=new sn,xi=new I,vi=new I,_i=new I,Ln=new I,Bn=new I,Zn=new I,ns=new I,Ts=new I,bs=new I,$n=new I;function Lr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){$n.fromArray(s,r);const o=i.x*Math.abs($n.x)+i.y*Math.abs($n.y)+i.z*Math.abs($n.z),l=e.dot($n),c=t.dot($n),u=n.dot($n);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const vd=new sn,is=new I,Br=new I;class _r{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):vd.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;is.subVectors(e,this.center);const t=is.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(is,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Br.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(is.copy(e.center).add(Br)),this.expandByPoint(is.copy(e.center).sub(Br))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const yn=new I,Ur=new I,ws=new I,Un=new I,Or=new I,Rs=new I,Nr=new I;let Ic=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(yn.copy(this.origin).addScaledVector(this.direction,t),yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Ur.copy(e).add(t).multiplyScalar(.5),ws.copy(t).sub(e).normalize(),Un.copy(this.origin).sub(Ur);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ws),o=Un.dot(this.direction),l=-Un.dot(ws),c=Un.lengthSq(),u=Math.abs(1-a*a);let d,p,h,g;if(u>0)if(d=a*l-o,p=a*o-l,g=r*u,d>=0)if(p>=-g)if(p<=g){const A=1/u;d*=A,p*=A,h=d*(d+a*p+2*o)+p*(a*d+p+2*l)+c}else p=r,d=Math.max(0,-(a*p+o)),h=-d*d+p*(p+2*l)+c;else p=-r,d=Math.max(0,-(a*p+o)),h=-d*d+p*(p+2*l)+c;else p<=-g?(d=Math.max(0,-(-a*r+o)),p=d>0?-r:Math.min(Math.max(-r,-l),r),h=-d*d+p*(p+2*l)+c):p<=g?(d=0,p=Math.min(Math.max(-r,-l),r),h=p*(p+2*l)+c):(d=Math.max(0,-(a*r+o)),p=d>0?r:Math.min(Math.max(-r,-l),r),h=-d*d+p*(p+2*l)+c);else p=a>0?-r:r,d=Math.max(0,-(a*p+o)),h=-d*d+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Ur).addScaledVector(ws,p),h}intersectSphere(e,t){yn.subVectors(e.center,this.origin);const n=yn.dot(this.direction),i=yn.dot(yn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,p=this.origin;return c>=0?(n=(e.min.x-p.x)*c,i=(e.max.x-p.x)*c):(n=(e.max.x-p.x)*c,i=(e.min.x-p.x)*c),u>=0?(r=(e.min.y-p.y)*u,a=(e.max.y-p.y)*u):(r=(e.max.y-p.y)*u,a=(e.min.y-p.y)*u),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-p.z)*d,l=(e.max.z-p.z)*d):(o=(e.max.z-p.z)*d,l=(e.min.z-p.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,yn)!==null}intersectTriangle(e,t,n,i,r){Or.subVectors(t,e),Rs.subVectors(n,e),Nr.crossVectors(Or,Rs);let a=this.direction.dot(Nr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Un.subVectors(this.origin,e);const l=o*this.direction.dot(Rs.crossVectors(Un,Rs));if(l<0)return null;const c=o*this.direction.dot(Or.cross(Un));if(c<0||l+c>a)return null;const u=-o*Un.dot(Nr);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}};class ke{constructor(e,t,n,i,r,a,o,l,c,u,d,p,h,g,A,f){ke.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,u,d,p,h,g,A,f)}set(e,t,n,i,r,a,o,l,c,u,d,p,h,g,A,f){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=p,m[3]=h,m[7]=g,m[11]=A,m[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ke().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/yi.setFromMatrixColumn(e,0).length(),r=1/yi.setFromMatrixColumn(e,1).length(),a=1/yi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const p=a*u,h=a*d,g=o*u,A=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=h+g*c,t[5]=p-A*c,t[9]=-o*l,t[2]=A-p*c,t[6]=g+h*c,t[10]=a*l}else if(e.order==="YXZ"){const p=l*u,h=l*d,g=c*u,A=c*d;t[0]=p+A*o,t[4]=g*o-h,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=h*o-g,t[6]=A+p*o,t[10]=a*l}else if(e.order==="ZXY"){const p=l*u,h=l*d,g=c*u,A=c*d;t[0]=p-A*o,t[4]=-a*d,t[8]=g+h*o,t[1]=h+g*o,t[5]=a*u,t[9]=A-p*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const p=a*u,h=a*d,g=o*u,A=o*d;t[0]=l*u,t[4]=g*c-h,t[8]=p*c+A,t[1]=l*d,t[5]=A*c+p,t[9]=h*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const p=a*l,h=a*c,g=o*l,A=o*c;t[0]=l*u,t[4]=A-p*d,t[8]=g*d+h,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=h*d+g,t[10]=p-A*d}else if(e.order==="XZY"){const p=a*l,h=a*c,g=o*l,A=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=p*d+A,t[5]=a*u,t[9]=h*d-g,t[2]=g*d-h,t[6]=o*u,t[10]=A*d+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(_d,e,yd)}lookAt(e,t,n){const i=this.elements;return qt.subVectors(e,t),qt.lengthSq()===0&&(qt.z=1),qt.normalize(),On.crossVectors(n,qt),On.lengthSq()===0&&(Math.abs(n.z)===1?qt.x+=1e-4:qt.z+=1e-4,qt.normalize(),On.crossVectors(n,qt)),On.normalize(),Is.crossVectors(qt,On),i[0]=On.x,i[4]=Is.x,i[8]=qt.x,i[1]=On.y,i[5]=Is.y,i[9]=qt.y,i[2]=On.z,i[6]=Is.z,i[10]=qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],p=n[9],h=n[13],g=n[2],A=n[6],f=n[10],m=n[14],x=n[3],v=n[7],y=n[11],T=n[15],E=i[0],_=i[4],w=i[8],O=i[12],S=i[1],M=i[5],F=i[9],P=i[13],D=i[2],z=i[6],U=i[10],G=i[14],H=i[3],Y=i[7],ne=i[11],le=i[15];return r[0]=a*E+o*S+l*D+c*H,r[4]=a*_+o*M+l*z+c*Y,r[8]=a*w+o*F+l*U+c*ne,r[12]=a*O+o*P+l*G+c*le,r[1]=u*E+d*S+p*D+h*H,r[5]=u*_+d*M+p*z+h*Y,r[9]=u*w+d*F+p*U+h*ne,r[13]=u*O+d*P+p*G+h*le,r[2]=g*E+A*S+f*D+m*H,r[6]=g*_+A*M+f*z+m*Y,r[10]=g*w+A*F+f*U+m*ne,r[14]=g*O+A*P+f*G+m*le,r[3]=x*E+v*S+y*D+T*H,r[7]=x*_+v*M+y*z+T*Y,r[11]=x*w+v*F+y*U+T*ne,r[15]=x*O+v*P+y*G+T*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],p=e[10],h=e[14],g=e[3],A=e[7],f=e[11],m=e[15];return g*(+r*l*d-i*c*d-r*o*p+n*c*p+i*o*h-n*l*h)+A*(+t*l*h-t*c*p+r*a*p-i*a*h+i*c*u-r*l*u)+f*(+t*c*d-t*o*h-r*a*d+n*a*h+r*o*u-n*c*u)+m*(-i*o*u-t*l*d+t*o*p+i*a*d-n*a*p+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],p=e[10],h=e[11],g=e[12],A=e[13],f=e[14],m=e[15],x=d*f*c-A*p*c+A*l*h-o*f*h-d*l*m+o*p*m,v=g*p*c-u*f*c-g*l*h+a*f*h+u*l*m-a*p*m,y=u*A*c-g*d*c+g*o*h-a*A*h-u*o*m+a*d*m,T=g*d*l-u*A*l-g*o*p+a*A*p+u*o*f-a*d*f,E=t*x+n*v+i*y+r*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const _=1/E;return e[0]=x*_,e[1]=(A*p*r-d*f*r-A*i*h+n*f*h+d*i*m-n*p*m)*_,e[2]=(o*f*r-A*l*r+A*i*c-n*f*c-o*i*m+n*l*m)*_,e[3]=(d*l*r-o*p*r-d*i*c+n*p*c+o*i*h-n*l*h)*_,e[4]=v*_,e[5]=(u*f*r-g*p*r+g*i*h-t*f*h-u*i*m+t*p*m)*_,e[6]=(g*l*r-a*f*r-g*i*c+t*f*c+a*i*m-t*l*m)*_,e[7]=(a*p*r-u*l*r+u*i*c-t*p*c-a*i*h+t*l*h)*_,e[8]=y*_,e[9]=(g*d*r-u*A*r-g*n*h+t*A*h+u*n*m-t*d*m)*_,e[10]=(a*A*r-g*o*r+g*n*c-t*A*c-a*n*m+t*o*m)*_,e[11]=(u*o*r-a*d*r-u*n*c+t*d*c+a*n*h-t*o*h)*_,e[12]=T*_,e[13]=(u*A*i-g*d*i+g*n*p-t*A*p-u*n*f+t*d*f)*_,e[14]=(g*o*i-a*A*i-g*n*l+t*A*l+a*n*f-t*o*f)*_,e[15]=(a*d*i-u*o*i+u*n*l-t*d*l-a*n*p+t*o*p)*_,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,d=o+o,p=r*c,h=r*u,g=r*d,A=a*u,f=a*d,m=o*d,x=l*c,v=l*u,y=l*d,T=n.x,E=n.y,_=n.z;return i[0]=(1-(A+m))*T,i[1]=(h+y)*T,i[2]=(g-v)*T,i[3]=0,i[4]=(h-y)*E,i[5]=(1-(p+m))*E,i[6]=(f+x)*E,i[7]=0,i[8]=(g+v)*_,i[9]=(f-x)*_,i[10]=(1-(p+A))*_,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=yi.set(i[0],i[1],i[2]).length();const a=yi.set(i[4],i[5],i[6]).length(),o=yi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],cn.copy(this);const c=1/r,u=1/a,d=1/o;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=u,cn.elements[5]*=u,cn.elements[6]*=u,cn.elements[8]*=d,cn.elements[9]*=d,cn.elements[10]*=d,t.setFromRotationMatrix(cn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a,o=Pn){const l=this.elements,c=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),p=(n+i)/(n-i);let h,g;if(o===Pn)h=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===ur)h=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=h,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=Pn){const l=this.elements,c=1/(t-e),u=1/(n-i),d=1/(a-r),p=(t+e)*c,h=(n+i)*u;let g,A;if(o===Pn)g=(a+r)*d,A=-2*d;else if(o===ur)g=r*d,A=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-h,l[2]=0,l[6]=0,l[10]=A,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const yi=new I,cn=new ke,_d=new I(0,0,0),yd=new I(1,1,1),On=new I,Is=new I,qt=new I,Jo=new ke,el=new ut;class xn{constructor(e=0,t=0,n=0,i=xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],d=i[2],p=i[6],h=i[10];switch(t){case"XYZ":this._y=Math.asin(Pt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Pt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(p,h),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Pt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-Pt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,h),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Jo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Jo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return el.setFromEuler(this),this.setFromQuaternion(el,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xn.DEFAULT_ORDER="XYZ";class Pc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Md=0;const tl=new I,Mi=new ut,Mn=new ke,Ps=new I,ss=new I,Cd=new I,Ed=new ut,nl=new I(1,0,0),il=new I(0,1,0),sl=new I(0,0,1),rl={type:"added"},Td={type:"removed"},Ci={type:"childadded",child:null},zr={type:"childremoved",child:null};class Ct extends fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Md++}),this.uuid=$i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new I,t=new xn,n=new ut,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ke},normalMatrix:{value:new ze}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.premultiply(Mi),this}rotateX(e){return this.rotateOnAxis(nl,e)}rotateY(e){return this.rotateOnAxis(il,e)}rotateZ(e){return this.rotateOnAxis(sl,e)}translateOnAxis(e,t){return tl.copy(e).applyQuaternion(this.quaternion),this.position.add(tl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(nl,e)}translateY(e){return this.translateOnAxis(il,e)}translateZ(e){return this.translateOnAxis(sl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ps.copy(e):Ps.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(ss,Ps,this.up):Mn.lookAt(Ps,ss,this.up),this.quaternion.setFromRotationMatrix(Mn),i&&(Mn.extractRotation(i.matrixWorld),Mi.setFromRotationMatrix(Mn),this.quaternion.premultiply(Mi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(rl),Ci.child=e,this.dispatchEvent(Ci),Ci.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Td),zr.child=e,this.dispatchEvent(zr),zr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(rl),Ci.child=e,this.dispatchEvent(Ci),Ci.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,e,Cd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,Ed,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),p=a(e.skeletons),h=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),p.length>0&&(n.skeletons=p),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Ct.DEFAULT_UP=new I(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const un=new I,Cn=new I,kr=new I,En=new I,Ei=new I,Ti=new I,al=new I,Hr=new I,Vr=new I,Gr=new I,Wr=new ft,Xr=new ft,qr=new ft;class hn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),un.subVectors(e,t),i.cross(un);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){un.subVectors(i,t),Cn.subVectors(n,t),kr.subVectors(e,t);const a=un.dot(un),o=un.dot(Cn),l=un.dot(kr),c=Cn.dot(Cn),u=Cn.dot(kr),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const p=1/d,h=(c*l-o*u)*p,g=(a*u-o*l)*p;return r.set(1-h-g,g,h)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,En.x),l.addScaledVector(a,En.y),l.addScaledVector(o,En.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return Wr.setScalar(0),Xr.setScalar(0),qr.setScalar(0),Wr.fromBufferAttribute(e,t),Xr.fromBufferAttribute(e,n),qr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Wr,r.x),a.addScaledVector(Xr,r.y),a.addScaledVector(qr,r.z),a}static isFrontFacing(e,t,n,i){return un.subVectors(n,t),Cn.subVectors(e,t),un.cross(Cn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return un.subVectors(this.c,this.b),Cn.subVectors(this.a,this.b),un.cross(Cn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return hn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return hn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Ei.subVectors(i,n),Ti.subVectors(r,n),Hr.subVectors(e,n);const l=Ei.dot(Hr),c=Ti.dot(Hr);if(l<=0&&c<=0)return t.copy(n);Vr.subVectors(e,i);const u=Ei.dot(Vr),d=Ti.dot(Vr);if(u>=0&&d<=u)return t.copy(i);const p=l*d-u*c;if(p<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Ei,a);Gr.subVectors(e,r);const h=Ei.dot(Gr),g=Ti.dot(Gr);if(g>=0&&h<=g)return t.copy(r);const A=h*c-l*g;if(A<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ti,o);const f=u*g-h*d;if(f<=0&&d-u>=0&&h-g>=0)return al.subVectors(r,i),o=(d-u)/(d-u+(h-g)),t.copy(i).addScaledVector(al,o);const m=1/(f+A+p);return a=A*m,o=p*m,t.copy(n).addScaledVector(Ei,a).addScaledVector(Ti,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Dc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},Ds={h:0,s:0,l:0};function Qr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=pn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=nt.workingColorSpace){if(e=ho(e,1),t=Pt(t,0,1),n=Pt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Qr(a,r,e+1/3),this.g=Qr(a,r,e),this.b=Qr(a,r,e-1/3)}return nt.toWorkingColorSpace(this,i),this}setStyle(e,t=pn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=pn){const n=Dc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=Pr(e.r),this.g=Pr(e.g),this.b=Pr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=pn){return nt.fromWorkingColorSpace(Ft.copy(this),e),Math.round(Pt(Ft.r*255,0,255))*65536+Math.round(Pt(Ft.g*255,0,255))*256+Math.round(Pt(Ft.b*255,0,255))}getHexString(e=pn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.fromWorkingColorSpace(Ft.copy(this),t);const n=Ft.r,i=Ft.g,r=Ft.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=nt.workingColorSpace){return nt.fromWorkingColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=pn){nt.fromWorkingColorSpace(Ft.copy(this),e);const t=Ft.r,n=Ft.g,i=Ft.b;return e!==pn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Nn),this.setHSL(Nn.h+e,Nn.s+t,Nn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Nn),e.getHSL(Ds);const n=ls(Nn.h,Ds.h,t),i=ls(Nn.s,Ds.s,t),r=ls(Nn.l,Ds.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ft=new Ze;Ze.NAMES=Dc;let bd=0;class yr extends fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bd++}),this.uuid=$i(),this.name="",this.type="Material",this.blending=qn,this.side=An,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ps,this.blendDst=ms,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=Gi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ai,this.stencilZFail=Ai,this.stencilZPass=Ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qn&&(n.blending=this.blending),this.side!==An&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ps&&(n.blendSrc=this.blendSrc),this.blendDst!==ms&&(n.blendDst=this.blendDst),this.blendEquation!==si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Gi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Xo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class hi extends yr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=pc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rn=wd();function wd(){const s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;!(c&8388608);)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function Rd(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=Pt(s,-65504,65504),Rn.floatView[0]=s;const e=Rn.uint32View[0],t=e>>23&511;return Rn.baseTable[t]+((e&8388607)>>Rn.shiftTable[t])}function Id(s){const e=s>>10;return Rn.uint32View[0]=Rn.mantissaTable[Rn.offsetTable[e]+(s&1023)]+Rn.exponentTable[e],Rn.floatView[0]}const Ss={toHalfFloat:Rd,fromHalfFloat:Id},_t=new I,Fs=new Me;class rn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=qo,this.updateRanges=[],this.gpuType=fn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Fs.fromBufferAttribute(this,t),Fs.applyMatrix3(e),this.setXY(t,Fs.x,Fs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Li(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Li(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Li(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Li(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Li(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),i=Lt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),i=Lt(i,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==qo&&(e.usage=this.usage),e}}class Fc extends rn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Lc extends rn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Kt extends rn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Pd=0;const $t=new ke,Yr=new Ct,bi=new I,Qt=new sn,rs=new sn,bt=new I;class an extends fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=$i(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(bc(e)?Lc:Fc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return Yr.lookAt(e),Yr.updateMatrix(),this.applyMatrix4(Yr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Kt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Qt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Qt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Qt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Qt.min),this.boundingBox.expandByPoint(Qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _r);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(Qt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];rs.setFromBufferAttribute(o),this.morphTargetsRelative?(bt.addVectors(Qt.min,rs.min),Qt.expandByPoint(bt),bt.addVectors(Qt.max,rs.max),Qt.expandByPoint(bt)):(Qt.expandByPoint(rs.min),Qt.expandByPoint(rs.max))}Qt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)bt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(bt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)bt.fromBufferAttribute(o,c),l&&(bi.fromBufferAttribute(e,c),bt.add(bi)),i=Math.max(i,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let w=0;w<n.count;w++)o[w]=new I,l[w]=new I;const c=new I,u=new I,d=new I,p=new Me,h=new Me,g=new Me,A=new I,f=new I;function m(w,O,S){c.fromBufferAttribute(n,w),u.fromBufferAttribute(n,O),d.fromBufferAttribute(n,S),p.fromBufferAttribute(r,w),h.fromBufferAttribute(r,O),g.fromBufferAttribute(r,S),u.sub(c),d.sub(c),h.sub(p),g.sub(p);const M=1/(h.x*g.y-g.x*h.y);isFinite(M)&&(A.copy(u).multiplyScalar(g.y).addScaledVector(d,-h.y).multiplyScalar(M),f.copy(d).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(M),o[w].add(A),o[O].add(A),o[S].add(A),l[w].add(f),l[O].add(f),l[S].add(f))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let w=0,O=x.length;w<O;++w){const S=x[w],M=S.start,F=S.count;for(let P=M,D=M+F;P<D;P+=3)m(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const v=new I,y=new I,T=new I,E=new I;function _(w){T.fromBufferAttribute(i,w),E.copy(T);const O=o[w];v.copy(O),v.sub(T.multiplyScalar(T.dot(O))).normalize(),y.crossVectors(E,O);const M=y.dot(l[w])<0?-1:1;a.setXYZW(w,v.x,v.y,v.z,M)}for(let w=0,O=x.length;w<O;++w){const S=x[w],M=S.start,F=S.count;for(let P=M,D=M+F;P<D;P+=3)_(e.getX(P+0)),_(e.getX(P+1)),_(e.getX(P+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new rn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,h=n.count;p<h;p++)n.setXYZ(p,0,0,0);const i=new I,r=new I,a=new I,o=new I,l=new I,c=new I,u=new I,d=new I;if(e)for(let p=0,h=e.count;p<h;p+=3){const g=e.getX(p+0),A=e.getX(p+1),f=e.getX(p+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,A),a.fromBufferAttribute(t,f),u.subVectors(a,r),d.subVectors(i,r),u.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,A),c.fromBufferAttribute(n,f),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(A,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let p=0,h=t.count;p<h;p+=3)i.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),u.subVectors(a,r),d.subVectors(i,r),u.cross(d),n.setXYZ(p+0,u.x,u.y,u.z),n.setXYZ(p+1,u.x,u.y,u.z),n.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,p=new c.constructor(l.length*u);let h=0,g=0;for(let A=0,f=l.length;A<f;A++){o.isInterleavedBufferAttribute?h=l[A]*o.data.stride+o.offset:h=l[A]*u;for(let m=0;m<u;m++)p[g++]=c[h++]}return new rn(p,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new an,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){const p=c[u],h=e(p,n);l.push(h)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,p=c.length;d<p;d++){const h=c[d];u.push(h.toJSON(e.data))}u.length>0&&(i[l]=u,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let p=0,h=d.length;p<h;p++)u.push(d[p].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ol=new ke,Jn=new Ic,Ls=new _r,ll=new I,Bs=new I,Us=new I,Os=new I,Kr=new I,Ns=new I,cl=new I,zs=new I;class St extends Ct{constructor(e=new an,t=new hi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Ns.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],d=r[l];u!==0&&(Kr.fromBufferAttribute(d,e),a?Ns.addScaledVector(Kr,u):Ns.addScaledVector(Kr.sub(t),u))}t.add(Ns)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ls.copy(n.boundingSphere),Ls.applyMatrix4(r),Jn.copy(e.ray).recast(e.near),!(Ls.containsPoint(Jn.origin)===!1&&(Jn.intersectSphere(Ls,ll)===null||Jn.origin.distanceToSquared(ll)>(e.far-e.near)**2))&&(ol.copy(r).invert(),Jn.copy(e.ray).applyMatrix4(ol),!(n.boundingBox!==null&&Jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Jn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,p=r.groups,h=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,A=p.length;g<A;g++){const f=p[g],m=a[f.materialIndex],x=Math.max(f.start,h.start),v=Math.min(o.count,Math.min(f.start+f.count,h.start+h.count));for(let y=x,T=v;y<T;y+=3){const E=o.getX(y),_=o.getX(y+1),w=o.getX(y+2);i=ks(this,m,e,n,c,u,d,E,_,w),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=f.materialIndex,t.push(i))}}else{const g=Math.max(0,h.start),A=Math.min(o.count,h.start+h.count);for(let f=g,m=A;f<m;f+=3){const x=o.getX(f),v=o.getX(f+1),y=o.getX(f+2);i=ks(this,a,e,n,c,u,d,x,v,y),i&&(i.faceIndex=Math.floor(f/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,A=p.length;g<A;g++){const f=p[g],m=a[f.materialIndex],x=Math.max(f.start,h.start),v=Math.min(l.count,Math.min(f.start+f.count,h.start+h.count));for(let y=x,T=v;y<T;y+=3){const E=y,_=y+1,w=y+2;i=ks(this,m,e,n,c,u,d,E,_,w),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=f.materialIndex,t.push(i))}}else{const g=Math.max(0,h.start),A=Math.min(l.count,h.start+h.count);for(let f=g,m=A;f<m;f+=3){const x=f,v=f+1,y=f+2;i=ks(this,a,e,n,c,u,d,x,v,y),i&&(i.faceIndex=Math.floor(f/3),t.push(i))}}}}function Dd(s,e,t,n,i,r,a,o){let l;if(e.side===Gt?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===An,o),l===null)return null;zs.copy(o),zs.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(zs);return c<t.near||c>t.far?null:{distance:c,point:zs.clone(),object:s}}function ks(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Bs),s.getVertexPosition(l,Us),s.getVertexPosition(c,Os);const u=Dd(s,e,t,n,Bs,Us,Os,cl);if(u){const d=new I;hn.getBarycoord(cl,Bs,Us,Os,d),i&&(u.uv=hn.getInterpolatedAttribute(i,o,l,c,d,new Me)),r&&(u.uv1=hn.getInterpolatedAttribute(r,o,l,c,d,new Me)),a&&(u.normal=hn.getInterpolatedAttribute(a,o,l,c,d,new I),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const p={a:o,b:l,c,normal:new I,materialIndex:0};hn.getNormal(Bs,Us,Os,p.normal),u.face=p,u.barycoord=d}return u}class Ji extends an{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],d=[];let p=0,h=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(u,3)),this.setAttribute("uv",new Kt(d,2));function g(A,f,m,x,v,y,T,E,_,w,O){const S=y/_,M=T/w,F=y/2,P=T/2,D=E/2,z=_+1,U=w+1;let G=0,H=0;const Y=new I;for(let ne=0;ne<U;ne++){const le=ne*M-P;for(let Be=0;Be<z;Be++){const Re=Be*S-F;Y[A]=Re*x,Y[f]=le*v,Y[m]=D,c.push(Y.x,Y.y,Y.z),Y[A]=0,Y[f]=0,Y[m]=E>0?1:-1,u.push(Y.x,Y.y,Y.z),d.push(Be/_),d.push(1-ne/w),G+=1}}for(let ne=0;ne<w;ne++)for(let le=0;le<_;le++){const Be=p+le+z*ne,Re=p+le+z*(ne+1),X=p+(le+1)+z*(ne+1),$=p+(le+1)+z*ne;l.push(Be,Re,$),l.push(Re,X,$),H+=6}o.addGroup(h,H,O),h+=H,p+=G}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ji(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Yi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Bt(s){const e={};for(let t=0;t<s.length;t++){const n=Yi(s[t]);for(const i in n)e[i]=n[i]}return e}function Fd(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Bc(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const Ld={clone:Yi,merge:Bt};var Bd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ud=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class jt extends yr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bd,this.fragmentShader=Ud,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yi(e.uniforms),this.uniformsGroups=Fd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Uc extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=Pn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zn=new I,ul=new Me,dl=new Me;class en extends Uc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=As*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(os*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return As*2*Math.atan(Math.tan(os*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zn.x,zn.y).multiplyScalar(-e/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zn.x,zn.y).multiplyScalar(-e/zn.z)}getViewSize(e,t){return this.getViewBounds(e,ul,dl),t.subVectors(dl,ul)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(os*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const wi=-90,Ri=1;class Od extends Ct{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new en(wi,Ri,e,t);i.layers=this.layers,this.add(i);const r=new en(wi,Ri,e,t);r.layers=this.layers,this.add(r);const a=new en(wi,Ri,e,t);a.layers=this.layers,this.add(a);const o=new en(wi,Ri,e,t);o.layers=this.layers,this.add(o);const l=new en(wi,Ri,e,t);l.layers=this.layers,this.add(l);const c=new en(wi,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Pn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ur)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,d=e.getRenderTarget(),p=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const A=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=A,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(d,p,h),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Oc extends Nt{constructor(e,t,n,i,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Wi,super(e,t,n,i,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Nd extends Yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Oc(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:dn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ji(5,5,5),r=new jt({name:"CubemapFromEquirect",uniforms:Yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gt,blending:Xn});r.uniforms.tEquirect.value=t;const a=new St(i,r),o=t.minFilter;return t.minFilter===ci&&(t.minFilter=dn),new Od(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}const jr=new I,zd=new I,kd=new ze;class Vn{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=jr.subVectors(n,t).cross(zd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(jr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||kd.getNormalMatrix(e),i=this.coplanarPoint(jr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ei=new _r,Hs=new I;class Nc{constructor(e=new Vn,t=new Vn,n=new Vn,i=new Vn,r=new Vn,a=new Vn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Pn){const n=this.planes,i=e.elements,r=i[0],a=i[1],o=i[2],l=i[3],c=i[4],u=i[5],d=i[6],p=i[7],h=i[8],g=i[9],A=i[10],f=i[11],m=i[12],x=i[13],v=i[14],y=i[15];if(n[0].setComponents(l-r,p-c,f-h,y-m).normalize(),n[1].setComponents(l+r,p+c,f+h,y+m).normalize(),n[2].setComponents(l+a,p+u,f+g,y+x).normalize(),n[3].setComponents(l-a,p-u,f-g,y-x).normalize(),n[4].setComponents(l-o,p-d,f-A,y-v).normalize(),t===Pn)n[5].setComponents(l+o,p+d,f+A,y+v).normalize();else if(t===ur)n[5].setComponents(o,d,A,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ei.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ei.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ei)}intersectsSprite(e){return ei.center.set(0,0,0),ei.radius=.7071067811865476,ei.applyMatrix4(e.matrixWorld),this.intersectsSphere(ei)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Hs.x=i.normal.x>0?e.max.x:e.min.x,Hs.y=i.normal.y>0?e.max.y:e.min.y,Hs.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Hs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function zc(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Hd(s){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,d=c.byteLength,p=s.createBuffer();s.bindBuffer(l,p),s.bufferData(l,c,u),o.onUploadCallback();let h;if(c instanceof Float32Array)h=s.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?h=s.HALF_FLOAT:h=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=s.SHORT;else if(c instanceof Uint32Array)h=s.UNSIGNED_INT;else if(c instanceof Int32Array)h=s.INT;else if(c instanceof Int8Array)h=s.BYTE;else if(c instanceof Uint8Array)h=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const u=l.array,d=l.updateRanges;if(s.bindBuffer(c,o),d.length===0)s.bufferSubData(c,0,u);else{d.sort((h,g)=>h.start-g.start);let p=0;for(let h=1;h<d.length;h++){const g=d[p],A=d[h];A.start<=g.start+g.count+1?g.count=Math.max(g.count,A.start+A.count-g.start):(++p,d[p]=A)}d.length=p+1;for(let h=0,g=d.length;h<g;h++){const A=d[h];s.bufferSubData(c,A.start*u.BYTES_PER_ELEMENT,u,A.start,A.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}class Ki extends an{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,d=e/o,p=t/l,h=[],g=[],A=[],f=[];for(let m=0;m<u;m++){const x=m*p-a;for(let v=0;v<c;v++){const y=v*d-r;g.push(y,-x,0),A.push(0,0,1),f.push(v/o),f.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<o;x++){const v=x+c*m,y=x+c*(m+1),T=x+1+c*(m+1),E=x+1+c*m;h.push(v,y,E),h.push(y,T,E)}this.setIndex(h),this.setAttribute("position",new Kt(g,3)),this.setAttribute("normal",new Kt(A,3)),this.setAttribute("uv",new Kt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ki(e.width,e.height,e.widthSegments,e.heightSegments)}}var Vd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Gd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Wd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Yd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Kd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Zd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$d=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Jd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,eh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,th=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,nh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ih=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ah=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,oh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ch=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,uh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,dh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,fh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ph=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ah=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sh="gl_FragColor = linearToOutputTexel( gl_FragColor );",xh=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,vh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,_h=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,yh=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Mh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ch=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Eh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Th=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,wh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Rh=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ih=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ph=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dh=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Fh=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Lh=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Uh=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Oh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Nh=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zh=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,kh=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hh=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vh=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Gh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wh=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xh=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qh=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qh=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Yh=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Kh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jh=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Zh=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$h=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Jh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ef=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,af=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,of=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,df=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,hf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ff=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Af=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Sf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_f=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Cf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Ef=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,wf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,If=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Df=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ff=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Lf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Uf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Of=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Nf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Vf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Kf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Zf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,$f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Jf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ep=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,np=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ip=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ap=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,op=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,up=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,fp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ap=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_p=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:Vd,alphahash_pars_fragment:Gd,alphamap_fragment:Wd,alphamap_pars_fragment:Xd,alphatest_fragment:qd,alphatest_pars_fragment:Qd,aomap_fragment:Yd,aomap_pars_fragment:Kd,batching_pars_vertex:jd,batching_vertex:Zd,begin_vertex:$d,beginnormal_vertex:Jd,bsdfs:eh,iridescence_fragment:th,bumpmap_pars_fragment:nh,clipping_planes_fragment:ih,clipping_planes_pars_fragment:sh,clipping_planes_pars_vertex:rh,clipping_planes_vertex:ah,color_fragment:oh,color_pars_fragment:lh,color_pars_vertex:ch,color_vertex:uh,common:dh,cube_uv_reflection_fragment:hh,defaultnormal_vertex:fh,displacementmap_pars_vertex:ph,displacementmap_vertex:mh,emissivemap_fragment:gh,emissivemap_pars_fragment:Ah,colorspace_fragment:Sh,colorspace_pars_fragment:xh,envmap_fragment:vh,envmap_common_pars_fragment:_h,envmap_pars_fragment:yh,envmap_pars_vertex:Mh,envmap_physical_pars_fragment:Lh,envmap_vertex:Ch,fog_vertex:Eh,fog_pars_vertex:Th,fog_fragment:bh,fog_pars_fragment:wh,gradientmap_pars_fragment:Rh,lightmap_pars_fragment:Ih,lights_lambert_fragment:Ph,lights_lambert_pars_fragment:Dh,lights_pars_begin:Fh,lights_toon_fragment:Bh,lights_toon_pars_fragment:Uh,lights_phong_fragment:Oh,lights_phong_pars_fragment:Nh,lights_physical_fragment:zh,lights_physical_pars_fragment:kh,lights_fragment_begin:Hh,lights_fragment_maps:Vh,lights_fragment_end:Gh,logdepthbuf_fragment:Wh,logdepthbuf_pars_fragment:Xh,logdepthbuf_pars_vertex:qh,logdepthbuf_vertex:Qh,map_fragment:Yh,map_pars_fragment:Kh,map_particle_fragment:jh,map_particle_pars_fragment:Zh,metalnessmap_fragment:$h,metalnessmap_pars_fragment:Jh,morphinstance_vertex:ef,morphcolor_vertex:tf,morphnormal_vertex:nf,morphtarget_pars_vertex:sf,morphtarget_vertex:rf,normal_fragment_begin:af,normal_fragment_maps:of,normal_pars_fragment:lf,normal_pars_vertex:cf,normal_vertex:uf,normalmap_pars_fragment:df,clearcoat_normal_fragment_begin:hf,clearcoat_normal_fragment_maps:ff,clearcoat_pars_fragment:pf,iridescence_pars_fragment:mf,opaque_fragment:gf,packing:Af,premultiplied_alpha_fragment:Sf,project_vertex:xf,dithering_fragment:vf,dithering_pars_fragment:_f,roughnessmap_fragment:yf,roughnessmap_pars_fragment:Mf,shadowmap_pars_fragment:Cf,shadowmap_pars_vertex:Ef,shadowmap_vertex:Tf,shadowmask_pars_fragment:bf,skinbase_vertex:wf,skinning_pars_vertex:Rf,skinning_vertex:If,skinnormal_vertex:Pf,specularmap_fragment:Df,specularmap_pars_fragment:Ff,tonemapping_fragment:Lf,tonemapping_pars_fragment:Bf,transmission_fragment:Uf,transmission_pars_fragment:Of,uv_pars_fragment:Nf,uv_pars_vertex:zf,uv_vertex:kf,worldpos_vertex:Hf,background_vert:Vf,background_frag:Gf,backgroundCube_vert:Wf,backgroundCube_frag:Xf,cube_vert:qf,cube_frag:Qf,depth_vert:Yf,depth_frag:Kf,distanceRGBA_vert:jf,distanceRGBA_frag:Zf,equirect_vert:$f,equirect_frag:Jf,linedashed_vert:ep,linedashed_frag:tp,meshbasic_vert:np,meshbasic_frag:ip,meshlambert_vert:sp,meshlambert_frag:rp,meshmatcap_vert:ap,meshmatcap_frag:op,meshnormal_vert:lp,meshnormal_frag:cp,meshphong_vert:up,meshphong_frag:dp,meshphysical_vert:hp,meshphysical_frag:fp,meshtoon_vert:pp,meshtoon_frag:mp,points_vert:gp,points_frag:Ap,shadow_vert:Sp,shadow_frag:xp,sprite_vert:vp,sprite_frag:_p},pe={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new Me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},mn={basic:{uniforms:Bt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Bt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ze(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Bt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Bt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Bt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new Ze(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Bt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Bt([pe.points,pe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Bt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Bt([pe.common,pe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Bt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Bt([pe.sprite,pe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Bt([pe.common,pe.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Bt([pe.lights,pe.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};mn.physical={uniforms:Bt([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const Vs={r:0,b:0,g:0},ti=new xn,yp=new ke;function Mp(s,e,t,n,i,r,a){const o=new Ze(0);let l=r===!0?0:1,c,u,d=null,p=0,h=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?t:e).get(v)),v}function A(x){let v=!1;const y=g(x);y===null?m(o,l):y&&y.isColor&&(m(y,1),v=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function f(x,v){const y=g(v);y&&(y.isCubeTexture||y.mapping===Sr)?(u===void 0&&(u=new St(new Ji(1,1,1),new jt({name:"BackgroundCubeMaterial",uniforms:Yi(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,E,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),ti.copy(v.backgroundRotation),ti.x*=-1,ti.y*=-1,ti.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ti.y*=-1,ti.z*=-1),u.material.uniforms.envMap.value=y,u.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(yp.makeRotationFromEuler(ti)),u.material.toneMapped=nt.getTransfer(y.colorSpace)!==lt,(d!==y||p!==y.version||h!==s.toneMapping)&&(u.material.needsUpdate=!0,d=y,p=y.version,h=s.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new St(new Ki(2,2),new jt({name:"BackgroundMaterial",uniforms:Yi(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=nt.getTransfer(y.colorSpace)!==lt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(d!==y||p!==y.version||h!==s.toneMapping)&&(c.material.needsUpdate=!0,d=y,p=y.version,h=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function m(x,v){x.getRGB(Vs,Bc(s)),n.buffers.color.setClear(Vs.r,Vs.g,Vs.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(x,v=1){o.set(x),l=v,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,m(o,l)},render:A,addToRenderList:f}}function Cp(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=p(null);let r=i,a=!1;function o(S,M,F,P,D){let z=!1;const U=d(P,F,M);r!==U&&(r=U,c(r.object)),z=h(S,P,F,D),z&&g(S,P,F,D),D!==null&&e.update(D,s.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,y(S,M,F,P),D!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(D).buffer))}function l(){return s.createVertexArray()}function c(S){return s.bindVertexArray(S)}function u(S){return s.deleteVertexArray(S)}function d(S,M,F){const P=F.wireframe===!0;let D=n[S.id];D===void 0&&(D={},n[S.id]=D);let z=D[M.id];z===void 0&&(z={},D[M.id]=z);let U=z[P];return U===void 0&&(U=p(l()),z[P]=U),U}function p(S){const M=[],F=[],P=[];for(let D=0;D<t;D++)M[D]=0,F[D]=0,P[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:M,enabledAttributes:F,attributeDivisors:P,object:S,attributes:{},index:null}}function h(S,M,F,P){const D=r.attributes,z=M.attributes;let U=0;const G=F.getAttributes();for(const H in G)if(G[H].location>=0){const ne=D[H];let le=z[H];if(le===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(le=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(le=S.instanceColor)),ne===void 0||ne.attribute!==le||le&&ne.data!==le.data)return!0;U++}return r.attributesNum!==U||r.index!==P}function g(S,M,F,P){const D={},z=M.attributes;let U=0;const G=F.getAttributes();for(const H in G)if(G[H].location>=0){let ne=z[H];ne===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(ne=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(ne=S.instanceColor));const le={};le.attribute=ne,ne&&ne.data&&(le.data=ne.data),D[H]=le,U++}r.attributes=D,r.attributesNum=U,r.index=P}function A(){const S=r.newAttributes;for(let M=0,F=S.length;M<F;M++)S[M]=0}function f(S){m(S,0)}function m(S,M){const F=r.newAttributes,P=r.enabledAttributes,D=r.attributeDivisors;F[S]=1,P[S]===0&&(s.enableVertexAttribArray(S),P[S]=1),D[S]!==M&&(s.vertexAttribDivisor(S,M),D[S]=M)}function x(){const S=r.newAttributes,M=r.enabledAttributes;for(let F=0,P=M.length;F<P;F++)M[F]!==S[F]&&(s.disableVertexAttribArray(F),M[F]=0)}function v(S,M,F,P,D,z,U){U===!0?s.vertexAttribIPointer(S,M,F,D,z):s.vertexAttribPointer(S,M,F,P,D,z)}function y(S,M,F,P){A();const D=P.attributes,z=F.getAttributes(),U=M.defaultAttributeValues;for(const G in z){const H=z[G];if(H.location>=0){let Y=D[G];if(Y===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(Y=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(Y=S.instanceColor)),Y!==void 0){const ne=Y.normalized,le=Y.itemSize,Be=e.get(Y);if(Be===void 0)continue;const Re=Be.buffer,X=Be.type,$=Be.bytesPerElement,re=X===s.INT||X===s.UNSIGNED_INT||Y.gpuType===ao;if(Y.isInterleavedBufferAttribute){const ae=Y.data,ye=ae.stride,Ae=Y.offset;if(ae.isInstancedInterleavedBuffer){for(let Ie=0;Ie<H.locationSize;Ie++)m(H.location+Ie,ae.meshPerAttribute);S.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ie=0;Ie<H.locationSize;Ie++)f(H.location+Ie);s.bindBuffer(s.ARRAY_BUFFER,Re);for(let Ie=0;Ie<H.locationSize;Ie++)v(H.location+Ie,le/H.locationSize,X,ne,ye*$,(Ae+le/H.locationSize*Ie)*$,re)}else{if(Y.isInstancedBufferAttribute){for(let ae=0;ae<H.locationSize;ae++)m(H.location+ae,Y.meshPerAttribute);S.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ae=0;ae<H.locationSize;ae++)f(H.location+ae);s.bindBuffer(s.ARRAY_BUFFER,Re);for(let ae=0;ae<H.locationSize;ae++)v(H.location+ae,le/H.locationSize,X,ne,le*$,le/H.locationSize*ae*$,re)}}else if(U!==void 0){const ne=U[G];if(ne!==void 0)switch(ne.length){case 2:s.vertexAttrib2fv(H.location,ne);break;case 3:s.vertexAttrib3fv(H.location,ne);break;case 4:s.vertexAttrib4fv(H.location,ne);break;default:s.vertexAttrib1fv(H.location,ne)}}}}x()}function T(){w();for(const S in n){const M=n[S];for(const F in M){const P=M[F];for(const D in P)u(P[D].object),delete P[D];delete M[F]}delete n[S]}}function E(S){if(n[S.id]===void 0)return;const M=n[S.id];for(const F in M){const P=M[F];for(const D in P)u(P[D].object),delete P[D];delete M[F]}delete n[S.id]}function _(S){for(const M in n){const F=n[M];if(F[S.id]===void 0)continue;const P=F[S.id];for(const D in P)u(P[D].object),delete P[D];delete F[S.id]}}function w(){O(),a=!0,r!==i&&(r=i,c(r.object))}function O(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:O,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:_,initAttributes:A,enableAttribute:f,disableUnusedAttributes:x}}function Ep(s,e,t){let n;function i(c){n=c}function r(c,u){s.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,d){d!==0&&(s.drawArraysInstanced(n,c,u,d),t.update(u,n,d))}function o(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,d);let h=0;for(let g=0;g<d;g++)h+=u[g];t.update(h,n,1)}function l(c,u,d,p){if(d===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let g=0;g<c.length;g++)a(c[g],u[g],p[g]);else{h.multiDrawArraysInstancedWEBGL(n,c,0,u,0,p,0,d);let g=0;for(let A=0;A<d;A++)g+=u[A];for(let A=0;A<p.length;A++)t.update(g,n,p[A])}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Tp(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(_){return!(_!==Ot&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const w=_===Zi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==Sn&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&_!==fn&&!w)}function l(_){if(_==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,p=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(p===!0){const _=e.get("EXT_clip_control");_.clipControlEXT(_.LOWER_LEFT_EXT,_.ZERO_TO_ONE_EXT)}const h=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),A=s.getParameter(s.MAX_TEXTURE_SIZE),f=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),v=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,E=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:p,maxTextures:h,maxVertexTextures:g,maxTextureSize:A,maxCubemapSize:f,maxAttributes:m,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:T,maxSamples:E}}function bp(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Vn,o=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,p){const h=d.length!==0||p||n!==0||i;return i=p,n=d.length,h},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,p){t=u(d,p,0)},this.setState=function(d,p,h){const g=d.clippingPlanes,A=d.clipIntersection,f=d.clipShadows,m=s.get(d);if(!i||g===null||g.length===0||r&&!f)r?u(null):c();else{const x=r?0:n,v=x*4;let y=m.clippingState||null;l.value=y,y=u(g,p,v,h);for(let T=0;T!==v;++T)y[T]=t[T];m.clippingState=y,this.numIntersection=A?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,p,h,g){const A=d!==null?d.length:0;let f=null;if(A!==0){if(f=l.value,g!==!0||f===null){const m=h+A*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(f===null||f.length<m)&&(f=new Float32Array(m));for(let v=0,y=h;v!==A;++v,y+=4)a.copy(d[v]).applyMatrix4(x,o),a.normal.toArray(f,y),f[y+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=A,e.numIntersection=0,f}}function wp(s){let e=new WeakMap;function t(a,o){return o===_a?a.mapping=Wi:o===ya&&(a.mapping=Xi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===_a||o===ya)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Nd(l.height);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class po extends Uc{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ui=4,hl=[.125,.215,.35,.446,.526,.582],ri=20,Zr=new po,fl=new Ze;let $r=null,Jr=0,ea=0,ta=!1;const ii=(1+Math.sqrt(5))/2,Ii=1/ii,pl=[new I(-ii,Ii,0),new I(ii,Ii,0),new I(-Ii,0,ii),new I(Ii,0,ii),new I(0,ii,-Ii),new I(0,ii,Ii),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)];class ml{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){$r=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),ea=this._renderer.getActiveMipmapLevel(),ta=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget($r,Jr,ea),this._renderer.xr.enabled=ta,e.scissorTest=!1,Gs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Wi||e.mapping===Xi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$r=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),ea=this._renderer.getActiveMipmapLevel(),ta=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:dn,minFilter:dn,generateMipmaps:!1,type:Zi,format:Ot,colorSpace:Kn,depthBuffer:!1},i=gl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Rp(r)),this._blurMaterial=Ip(r,e,t)}return i}_compileMaterial(e){const t=new St(this._lodPlanes[0],e);this._renderer.compile(t,Zr)}_sceneToCubeUV(e,t,n,i){const o=new en(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(fl),u.toneMapping=Qn,u.autoClear=!1;const h=new hi({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1}),g=new St(new Ji,h);let A=!1;const f=e.background;f?f.isColor&&(h.color.copy(f),e.background=null,A=!0):(h.color.copy(fl),A=!0);for(let m=0;m<6;m++){const x=m%3;x===0?(o.up.set(0,l[m],0),o.lookAt(c[m],0,0)):x===1?(o.up.set(0,0,l[m]),o.lookAt(0,c[m],0)):(o.up.set(0,l[m],0),o.lookAt(0,0,c[m]));const v=this._cubeSize;Gs(i,x*v,m>2?v:0,v,v),u.setRenderTarget(i),A&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=p,u.autoClear=d,e.background=f}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Wi||e.mapping===Xi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Al());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new St(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Gs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Zr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=pl[(i-r-1)%pl.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new St(this._lodPlanes[i],c),p=c.uniforms,h=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*h):2*Math.PI/(2*ri-1),A=r/g,f=isFinite(r)?1+Math.floor(u*A):ri;f>ri&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${ri}`);const m=[];let x=0;for(let _=0;_<ri;++_){const w=_/A,O=Math.exp(-w*w/2);m.push(O),_===0?x+=O:_<f&&(x+=2*O)}for(let _=0;_<m.length;_++)m[_]=m[_]/x;p.envMap.value=e.texture,p.samples.value=f,p.weights.value=m,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=g,p.mipInt.value=v-n;const y=this._sizeLods[i],T=3*y*(i>v-Ui?i-v+Ui:0),E=4*(this._cubeSize-y);Gs(t,T,E,3*y,2*y),l.setRenderTarget(t),l.render(d,Zr)}}function Rp(s){const e=[],t=[],n=[];let i=s;const r=s-Ui+1+hl.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>s-Ui?l=hl[a-s+Ui-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,d=1+c,p=[u,u,d,u,d,d,u,u,d,d,u,d],h=6,g=6,A=3,f=2,m=1,x=new Float32Array(A*g*h),v=new Float32Array(f*g*h),y=new Float32Array(m*g*h);for(let E=0;E<h;E++){const _=E%3*2/3-1,w=E>2?0:-1,O=[_,w,0,_+2/3,w,0,_+2/3,w+1,0,_,w,0,_+2/3,w+1,0,_,w+1,0];x.set(O,A*g*E),v.set(p,f*g*E);const S=[E,E,E,E,E,E];y.set(S,m*g*E)}const T=new an;T.setAttribute("position",new rn(x,A)),T.setAttribute("uv",new rn(v,f)),T.setAttribute("faceIndex",new rn(y,m)),e.push(T),i>Ui&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function gl(s,e,t){const n=new Yn(s,e,t);return n.texture.mapping=Sr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Gs(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Ip(s,e,t){const n=new Float32Array(ri),i=new I(0,1,0);return new jt({name:"SphericalGaussianBlur",defines:{n:ri,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:mo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Al(){return new jt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Sl(){return new jt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function mo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Pp(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===_a||l===ya,u=l===Wi||l===Xi;if(c||u){let d=e.get(o);const p=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new ml(s)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const h=o.image;return c&&h&&h.height>0||u&&h&&i(h)?(t===null&&(t=new ml(s)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function i(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Dp(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&rr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Fp(s,e,t,n){const i={},r=new WeakMap;function a(d){const p=d.target;p.index!==null&&e.remove(p.index);for(const g in p.attributes)e.remove(p.attributes[g]);for(const g in p.morphAttributes){const A=p.morphAttributes[g];for(let f=0,m=A.length;f<m;f++)e.remove(A[f])}p.removeEventListener("dispose",a),delete i[p.id];const h=r.get(p);h&&(e.remove(h),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(d,p){return i[p.id]===!0||(p.addEventListener("dispose",a),i[p.id]=!0,t.memory.geometries++),p}function l(d){const p=d.attributes;for(const g in p)e.update(p[g],s.ARRAY_BUFFER);const h=d.morphAttributes;for(const g in h){const A=h[g];for(let f=0,m=A.length;f<m;f++)e.update(A[f],s.ARRAY_BUFFER)}}function c(d){const p=[],h=d.index,g=d.attributes.position;let A=0;if(h!==null){const x=h.array;A=h.version;for(let v=0,y=x.length;v<y;v+=3){const T=x[v+0],E=x[v+1],_=x[v+2];p.push(T,E,E,_,_,T)}}else if(g!==void 0){const x=g.array;A=g.version;for(let v=0,y=x.length/3-1;v<y;v+=3){const T=v+0,E=v+1,_=v+2;p.push(T,E,E,_,_,T)}}else return;const f=new(bc(p)?Lc:Fc)(p,1);f.version=A;const m=r.get(d);m&&e.remove(m),r.set(d,f)}function u(d){const p=r.get(d);if(p){const h=d.index;h!==null&&p.version<h.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function Lp(s,e,t){let n;function i(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function l(p,h){s.drawElements(n,h,r,p*a),t.update(h,n,1)}function c(p,h,g){g!==0&&(s.drawElementsInstanced(n,h,r,p*a,g),t.update(h,n,g))}function u(p,h,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,p,0,g);let f=0;for(let m=0;m<g;m++)f+=h[m];t.update(f,n,1)}function d(p,h,g,A){if(g===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<p.length;m++)c(p[m]/a,h[m],A[m]);else{f.multiDrawElementsInstancedWEBGL(n,h,0,r,p,0,A,0,g);let m=0;for(let x=0;x<g;x++)m+=h[x];for(let x=0;x<A.length;x++)t.update(m,n,A[x])}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Bp(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Up(s,e,t){const n=new WeakMap,i=new ft;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let p=n.get(o);if(p===void 0||p.count!==d){let S=function(){w.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var h=S;p!==void 0&&p.texture.dispose();const g=o.morphAttributes.position!==void 0,A=o.morphAttributes.normal!==void 0,f=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),A===!0&&(y=2),f===!0&&(y=3);let T=o.attributes.position.count*y,E=1;T>e.maxTextureSize&&(E=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const _=new Float32Array(T*E*4*d),w=new Rc(_,T,E,d);w.type=fn,w.needsUpdate=!0;const O=y*4;for(let M=0;M<d;M++){const F=m[M],P=x[M],D=v[M],z=T*E*4*M;for(let U=0;U<F.count;U++){const G=U*O;g===!0&&(i.fromBufferAttribute(F,U),_[z+G+0]=i.x,_[z+G+1]=i.y,_[z+G+2]=i.z,_[z+G+3]=0),A===!0&&(i.fromBufferAttribute(P,U),_[z+G+4]=i.x,_[z+G+5]=i.y,_[z+G+6]=i.z,_[z+G+7]=0),f===!0&&(i.fromBufferAttribute(D,U),_[z+G+8]=i.x,_[z+G+9]=i.y,_[z+G+10]=i.z,_[z+G+11]=D.itemSize===4?i.w:1)}}p={count:d,texture:w,size:new Me(T,E)},n.set(o,p),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let g=0;for(let f=0;f<c.length;f++)g+=c[f];const A=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",A),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",p.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",p.size)}return{update:r}}function Op(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,d=e.get(l,u);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;i.get(p)!==c&&(p.update(),i.set(p,c))}return d}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class go extends Nt{constructor(e,t,n,i,r,a,o,l,c,u=di){if(u!==di&&u!==Qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===di&&(n=nn),n===void 0&&u===Qi&&(n=qi),super(null,i,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Vt,this.minFilter=l!==void 0?l:Vt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const kc=new Nt,xl=new go(1,1),Hc=new Rc,Vc=new xd,Gc=new Oc,vl=[],_l=[],yl=new Float32Array(16),Ml=new Float32Array(9),Cl=new Float32Array(4);function es(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=vl[i];if(r===void 0&&(r=new Float32Array(i),vl[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Et(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Tt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Mr(s,e){let t=_l[e];t===void 0&&(t=new Int32Array(e),_l[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Np(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function zp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;s.uniform2fv(this.addr,e),Tt(t,e)}}function kp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;s.uniform3fv(this.addr,e),Tt(t,e)}}function Hp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;s.uniform4fv(this.addr,e),Tt(t,e)}}function Vp(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;Cl.set(n),s.uniformMatrix2fv(this.addr,!1,Cl),Tt(t,n)}}function Gp(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;Ml.set(n),s.uniformMatrix3fv(this.addr,!1,Ml),Tt(t,n)}}function Wp(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;yl.set(n),s.uniformMatrix4fv(this.addr,!1,yl),Tt(t,n)}}function Xp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function qp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;s.uniform2iv(this.addr,e),Tt(t,e)}}function Qp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;s.uniform3iv(this.addr,e),Tt(t,e)}}function Yp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;s.uniform4iv(this.addr,e),Tt(t,e)}}function Kp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function jp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;s.uniform2uiv(this.addr,e),Tt(t,e)}}function Zp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;s.uniform3uiv(this.addr,e),Tt(t,e)}}function $p(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;s.uniform4uiv(this.addr,e),Tt(t,e)}}function Jp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(xl.compareFunction=Tc,r=xl):r=kc,t.setTexture2D(e||r,i)}function em(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Vc,i)}function tm(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Gc,i)}function nm(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Hc,i)}function im(s){switch(s){case 5126:return Np;case 35664:return zp;case 35665:return kp;case 35666:return Hp;case 35674:return Vp;case 35675:return Gp;case 35676:return Wp;case 5124:case 35670:return Xp;case 35667:case 35671:return qp;case 35668:case 35672:return Qp;case 35669:case 35673:return Yp;case 5125:return Kp;case 36294:return jp;case 36295:return Zp;case 36296:return $p;case 35678:case 36198:case 36298:case 36306:case 35682:return Jp;case 35679:case 36299:case 36307:return em;case 35680:case 36300:case 36308:case 36293:return tm;case 36289:case 36303:case 36311:case 36292:return nm}}function sm(s,e){s.uniform1fv(this.addr,e)}function rm(s,e){const t=es(e,this.size,2);s.uniform2fv(this.addr,t)}function am(s,e){const t=es(e,this.size,3);s.uniform3fv(this.addr,t)}function om(s,e){const t=es(e,this.size,4);s.uniform4fv(this.addr,t)}function lm(s,e){const t=es(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function cm(s,e){const t=es(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function um(s,e){const t=es(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function dm(s,e){s.uniform1iv(this.addr,e)}function hm(s,e){s.uniform2iv(this.addr,e)}function fm(s,e){s.uniform3iv(this.addr,e)}function pm(s,e){s.uniform4iv(this.addr,e)}function mm(s,e){s.uniform1uiv(this.addr,e)}function gm(s,e){s.uniform2uiv(this.addr,e)}function Am(s,e){s.uniform3uiv(this.addr,e)}function Sm(s,e){s.uniform4uiv(this.addr,e)}function xm(s,e,t){const n=this.cache,i=e.length,r=Mr(t,i);Et(n,r)||(s.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||kc,r[a])}function vm(s,e,t){const n=this.cache,i=e.length,r=Mr(t,i);Et(n,r)||(s.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Vc,r[a])}function _m(s,e,t){const n=this.cache,i=e.length,r=Mr(t,i);Et(n,r)||(s.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Gc,r[a])}function ym(s,e,t){const n=this.cache,i=e.length,r=Mr(t,i);Et(n,r)||(s.uniform1iv(this.addr,r),Tt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Hc,r[a])}function Mm(s){switch(s){case 5126:return sm;case 35664:return rm;case 35665:return am;case 35666:return om;case 35674:return lm;case 35675:return cm;case 35676:return um;case 5124:case 35670:return dm;case 35667:case 35671:return hm;case 35668:case 35672:return fm;case 35669:case 35673:return pm;case 5125:return mm;case 36294:return gm;case 36295:return Am;case 36296:return Sm;case 35678:case 36198:case 36298:case 36306:case 35682:return xm;case 35679:case 36299:case 36307:return vm;case 35680:case 36300:case 36308:case 36293:return _m;case 36289:case 36303:case 36311:case 36292:return ym}}class Cm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=im(t.type)}}class Em{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Mm(t.type)}}class Tm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const na=/(\w+)(\])?(\[|\.)?/g;function El(s,e){s.seq.push(e),s.map[e.id]=e}function bm(s,e,t){const n=s.name,i=n.length;for(na.lastIndex=0;;){const r=na.exec(n),a=na.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){El(t,c===void 0?new Cm(o,s,e):new Em(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new Tm(o),El(t,d)),t=d}}}class ar{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);bm(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Tl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const wm=37297;let Rm=0;function Im(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Pm(s){const e=nt.getPrimaries(nt.workingColorSpace),t=nt.getPrimaries(s);let n;switch(e===t?n="":e===cr&&t===lr?n="LinearDisplayP3ToLinearSRGB":e===lr&&t===cr&&(n="LinearSRGBToLinearDisplayP3"),s){case Kn:case vr:return[n,"LinearTransferOETF"];case pn:case uo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function bl(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Im(s.getShaderSource(e),a)}else return i}function Dm(s,e){const t=Pm(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Fm(s,e){let t;switch(e){case wu:t="Linear";break;case Ru:t="Reinhard";break;case Iu:t="Cineon";break;case Pu:t="ACESFilmic";break;case Fu:t="AgX";break;case Lu:t="Neutral";break;case Du:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ws=new I;function Lm(){nt.getLuminanceCoefficients(Ws);const s=Ws.x.toFixed(4),e=Ws.y.toFixed(4),t=Ws.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bm(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(as).join(`
`)}function Um(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Om(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function as(s){return s!==""}function wl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Rl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Nm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Za(s){return s.replace(Nm,km)}const zm=new Map;function km(s,e){let t=Xe[e];if(t===void 0){const n=zm.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Za(t)}const Hm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Il(s){return s.replace(Hm,Vm)}function Vm(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Pl(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Gm(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===hc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===lu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===bn&&(e="SHADOWMAP_TYPE_VSM"),e}function Wm(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Wi:case Xi:e="ENVMAP_TYPE_CUBE";break;case Sr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Xm(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Xi:e="ENVMAP_MODE_REFRACTION";break}return e}function qm(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case pc:e="ENVMAP_BLENDING_MULTIPLY";break;case Tu:e="ENVMAP_BLENDING_MIX";break;case bu:e="ENVMAP_BLENDING_ADD";break}return e}function Qm(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Ym(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Gm(t),c=Wm(t),u=Xm(t),d=qm(t),p=Qm(t),h=Bm(t),g=Um(r),A=i.createProgram();let f,m,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(as).join(`
`),f.length>0&&(f+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(as).join(`
`),m.length>0&&(m+=`
`)):(f=[Pl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(as).join(`
`),m=[Pl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qn?"#define TONE_MAPPING":"",t.toneMapping!==Qn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Qn?Fm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Dm("linearToOutputTexel",t.outputColorSpace),Lm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(as).join(`
`)),a=Za(a),a=wl(a,t),a=Rl(a,t),o=Za(o),o=wl(o,t),o=Rl(o,t),a=Il(a),o=Il(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,m=["#define varying in",t.glslVersion===Qo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Qo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const v=x+f+a,y=x+m+o,T=Tl(i,i.VERTEX_SHADER,v),E=Tl(i,i.FRAGMENT_SHADER,y);i.attachShader(A,T),i.attachShader(A,E),t.index0AttributeName!==void 0?i.bindAttribLocation(A,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(A,0,"position"),i.linkProgram(A);function _(M){if(s.debug.checkShaderErrors){const F=i.getProgramInfoLog(A).trim(),P=i.getShaderInfoLog(T).trim(),D=i.getShaderInfoLog(E).trim();let z=!0,U=!0;if(i.getProgramParameter(A,i.LINK_STATUS)===!1)if(z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,A,T,E);else{const G=bl(i,T,"vertex"),H=bl(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(A,i.VALIDATE_STATUS)+`

Material Name: `+M.name+`
Material Type: `+M.type+`

Program Info Log: `+F+`
`+G+`
`+H)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(P===""||D==="")&&(U=!1);U&&(M.diagnostics={runnable:z,programLog:F,vertexShader:{log:P,prefix:f},fragmentShader:{log:D,prefix:m}})}i.deleteShader(T),i.deleteShader(E),w=new ar(i,A),O=Om(i,A)}let w;this.getUniforms=function(){return w===void 0&&_(this),w};let O;this.getAttributes=function(){return O===void 0&&_(this),O};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=i.getProgramParameter(A,wm)),S},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(A),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Rm++,this.cacheKey=e,this.usedTimes=1,this.program=A,this.vertexShader=T,this.fragmentShader=E,this}let Km=0;class jm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Zm(e),t.set(e,n)),n}}class Zm{constructor(e){this.id=Km++,this.code=e,this.usedTimes=0}}function $m(s,e,t,n,i,r,a){const o=new Pc,l=new jm,c=new Set,u=[],d=i.logarithmicDepthBuffer,p=i.reverseDepthBuffer,h=i.vertexTextures;let g=i.precision;const A={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,M,F,P,D){const z=P.fog,U=D.geometry,G=S.isMeshStandardMaterial?P.environment:null,H=(S.isMeshStandardMaterial?t:e).get(S.envMap||G),Y=H&&H.mapping===Sr?H.image.height:null,ne=A[S.type];S.precision!==null&&(g=i.getMaxPrecision(S.precision),g!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",g,"instead."));const le=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Be=le!==void 0?le.length:0;let Re=0;U.morphAttributes.position!==void 0&&(Re=1),U.morphAttributes.normal!==void 0&&(Re=2),U.morphAttributes.color!==void 0&&(Re=3);let X,$,re,ae;if(ne){const zt=mn[ne];X=zt.vertexShader,$=zt.fragmentShader}else X=S.vertexShader,$=S.fragmentShader,l.update(S),re=l.getVertexShaderID(S),ae=l.getFragmentShaderID(S);const ye=s.getRenderTarget(),Ae=D.isInstancedMesh===!0,Ie=D.isBatchedMesh===!0,He=!!S.map,Oe=!!S.matcap,L=!!H,Ke=!!S.aoMap,Ce=!!S.lightMap,Ge=!!S.bumpMap,Pe=!!S.normalMap,We=!!S.displacementMap,be=!!S.emissiveMap,R=!!S.metalnessMap,C=!!S.roughnessMap,W=S.anisotropy>0,ee=S.clearcoat>0,se=S.dispersion>0,te=S.iridescence>0,we=S.sheen>0,fe=S.transmission>0,ve=W&&!!S.anisotropyMap,Ye=ee&&!!S.clearcoatMap,oe=ee&&!!S.clearcoatNormalMap,xe=ee&&!!S.clearcoatRoughnessMap,B=te&&!!S.iridescenceMap,ie=te&&!!S.iridescenceThicknessMap,ce=we&&!!S.sheenColorMap,Ue=we&&!!S.sheenRoughnessMap,De=!!S.specularMap,je=!!S.specularColorMap,N=!!S.specularIntensityMap,Se=fe&&!!S.transmissionMap,K=fe&&!!S.thicknessMap,J=!!S.gradientMap,he=!!S.alphaMap,me=S.alphaTest>0,qe=!!S.alphaHash,at=!!S.extensions;let yt=Qn;S.toneMapped&&(ye===null||ye.isXRRenderTarget===!0)&&(yt=s.toneMapping);const $e={shaderID:ne,shaderType:S.type,shaderName:S.name,vertexShader:X,fragmentShader:$,defines:S.defines,customVertexShaderID:re,customFragmentShaderID:ae,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:g,batching:Ie,batchingColor:Ie&&D._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&D.instanceColor!==null,instancingMorph:Ae&&D.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ye===null?s.outputColorSpace:ye.isXRRenderTarget===!0?ye.texture.colorSpace:Kn,alphaToCoverage:!!S.alphaToCoverage,map:He,matcap:Oe,envMap:L,envMapMode:L&&H.mapping,envMapCubeUVHeight:Y,aoMap:Ke,lightMap:Ce,bumpMap:Ge,normalMap:Pe,displacementMap:h&&We,emissiveMap:be,normalMapObjectSpace:Pe&&S.normalMapType===zu,normalMapTangentSpace:Pe&&S.normalMapType===Nu,metalnessMap:R,roughnessMap:C,anisotropy:W,anisotropyMap:ve,clearcoat:ee,clearcoatMap:Ye,clearcoatNormalMap:oe,clearcoatRoughnessMap:xe,dispersion:se,iridescence:te,iridescenceMap:B,iridescenceThicknessMap:ie,sheen:we,sheenColorMap:ce,sheenRoughnessMap:Ue,specularMap:De,specularColorMap:je,specularIntensityMap:N,transmission:fe,transmissionMap:Se,thicknessMap:K,gradientMap:J,opaque:S.transparent===!1&&S.blending===qn&&S.alphaToCoverage===!1,alphaMap:he,alphaTest:me,alphaHash:qe,combine:S.combine,mapUv:He&&f(S.map.channel),aoMapUv:Ke&&f(S.aoMap.channel),lightMapUv:Ce&&f(S.lightMap.channel),bumpMapUv:Ge&&f(S.bumpMap.channel),normalMapUv:Pe&&f(S.normalMap.channel),displacementMapUv:We&&f(S.displacementMap.channel),emissiveMapUv:be&&f(S.emissiveMap.channel),metalnessMapUv:R&&f(S.metalnessMap.channel),roughnessMapUv:C&&f(S.roughnessMap.channel),anisotropyMapUv:ve&&f(S.anisotropyMap.channel),clearcoatMapUv:Ye&&f(S.clearcoatMap.channel),clearcoatNormalMapUv:oe&&f(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&f(S.clearcoatRoughnessMap.channel),iridescenceMapUv:B&&f(S.iridescenceMap.channel),iridescenceThicknessMapUv:ie&&f(S.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&f(S.sheenColorMap.channel),sheenRoughnessMapUv:Ue&&f(S.sheenRoughnessMap.channel),specularMapUv:De&&f(S.specularMap.channel),specularColorMapUv:je&&f(S.specularColorMap.channel),specularIntensityMapUv:N&&f(S.specularIntensityMap.channel),transmissionMapUv:Se&&f(S.transmissionMap.channel),thicknessMapUv:K&&f(S.thicknessMap.channel),alphaMapUv:he&&f(S.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(Pe||W),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!U.attributes.uv&&(He||he),fog:!!z,useFog:S.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:p,skinning:D.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:Be,morphTextureStride:Re,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&F.length>0,shadowMapType:s.shadowMap.type,toneMapping:yt,decodeVideoTexture:He&&S.map.isVideoTexture===!0&&nt.getTransfer(S.map.colorSpace)===lt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===tn,flipSided:S.side===Gt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:at&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(at&&S.extensions.multiDraw===!0||Ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return $e.vertexUv1s=c.has(1),$e.vertexUv2s=c.has(2),$e.vertexUv3s=c.has(3),c.clear(),$e}function x(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const F in S.defines)M.push(F),M.push(S.defines[F]);return S.isRawShaderMaterial===!1&&(v(M,S),y(M,S),M.push(s.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function v(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function y(S,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.alphaToCoverage&&o.enable(20),S.push(o.mask)}function T(S){const M=A[S.type];let F;if(M){const P=mn[M];F=Ld.clone(P.uniforms)}else F=S.uniforms;return F}function E(S,M){let F;for(let P=0,D=u.length;P<D;P++){const z=u[P];if(z.cacheKey===M){F=z,++F.usedTimes;break}}return F===void 0&&(F=new Ym(s,M,S,r),u.push(F)),F}function _(S){if(--S.usedTimes===0){const M=u.indexOf(S);u[M]=u[u.length-1],u.pop(),S.destroy()}}function w(S){l.remove(S)}function O(){l.dispose()}return{getParameters:m,getProgramCacheKey:x,getUniforms:T,acquireProgram:E,releaseProgram:_,releaseShaderCache:w,programs:u,dispose:O}}function Jm(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function eg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Dl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Fl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d,p,h,g,A,f){let m=s[e];return m===void 0?(m={id:d.id,object:d,geometry:p,material:h,groupOrder:g,renderOrder:d.renderOrder,z:A,group:f},s[e]=m):(m.id=d.id,m.object=d,m.geometry=p,m.material=h,m.groupOrder=g,m.renderOrder=d.renderOrder,m.z=A,m.group=f),e++,m}function o(d,p,h,g,A,f){const m=a(d,p,h,g,A,f);h.transmission>0?n.push(m):h.transparent===!0?i.push(m):t.push(m)}function l(d,p,h,g,A,f){const m=a(d,p,h,g,A,f);h.transmission>0?n.unshift(m):h.transparent===!0?i.unshift(m):t.unshift(m)}function c(d,p){t.length>1&&t.sort(d||eg),n.length>1&&n.sort(p||Dl),i.length>1&&i.sort(p||Dl)}function u(){for(let d=e,p=s.length;d<p;d++){const h=s[d];if(h.id===null)break;h.id=null,h.object=null,h.geometry=null,h.material=null,h.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:u,sort:c}}function tg(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new Fl,s.set(n,[a])):i>=r.length?(a=new Fl,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function ng(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Ze};break;case"SpotLight":t={position:new I,direction:new I,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function ig(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Me,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let sg=0;function rg(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function ag(s){const e=new ng,t=ig(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const i=new I,r=new ke,a=new ke;function o(c){let u=0,d=0,p=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let h=0,g=0,A=0,f=0,m=0,x=0,v=0,y=0,T=0,E=0,_=0;c.sort(rg);for(let O=0,S=c.length;O<S;O++){const M=c[O],F=M.color,P=M.intensity,D=M.distance,z=M.shadow&&M.shadow.map?M.shadow.map.texture:null;if(M.isAmbientLight)u+=F.r*P,d+=F.g*P,p+=F.b*P;else if(M.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(M.sh.coefficients[U],P);_++}else if(M.isDirectionalLight){const U=e.get(M);if(U.color.copy(M.color).multiplyScalar(M.intensity),M.castShadow){const G=M.shadow,H=t.get(M);H.shadowIntensity=G.intensity,H.shadowBias=G.bias,H.shadowNormalBias=G.normalBias,H.shadowRadius=G.radius,H.shadowMapSize=G.mapSize,n.directionalShadow[h]=H,n.directionalShadowMap[h]=z,n.directionalShadowMatrix[h]=M.shadow.matrix,x++}n.directional[h]=U,h++}else if(M.isSpotLight){const U=e.get(M);U.position.setFromMatrixPosition(M.matrixWorld),U.color.copy(F).multiplyScalar(P),U.distance=D,U.coneCos=Math.cos(M.angle),U.penumbraCos=Math.cos(M.angle*(1-M.penumbra)),U.decay=M.decay,n.spot[A]=U;const G=M.shadow;if(M.map&&(n.spotLightMap[T]=M.map,T++,G.updateMatrices(M),M.castShadow&&E++),n.spotLightMatrix[A]=G.matrix,M.castShadow){const H=t.get(M);H.shadowIntensity=G.intensity,H.shadowBias=G.bias,H.shadowNormalBias=G.normalBias,H.shadowRadius=G.radius,H.shadowMapSize=G.mapSize,n.spotShadow[A]=H,n.spotShadowMap[A]=z,y++}A++}else if(M.isRectAreaLight){const U=e.get(M);U.color.copy(F).multiplyScalar(P),U.halfWidth.set(M.width*.5,0,0),U.halfHeight.set(0,M.height*.5,0),n.rectArea[f]=U,f++}else if(M.isPointLight){const U=e.get(M);if(U.color.copy(M.color).multiplyScalar(M.intensity),U.distance=M.distance,U.decay=M.decay,M.castShadow){const G=M.shadow,H=t.get(M);H.shadowIntensity=G.intensity,H.shadowBias=G.bias,H.shadowNormalBias=G.normalBias,H.shadowRadius=G.radius,H.shadowMapSize=G.mapSize,H.shadowCameraNear=G.camera.near,H.shadowCameraFar=G.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=M.shadow.matrix,v++}n.point[g]=U,g++}else if(M.isHemisphereLight){const U=e.get(M);U.skyColor.copy(M.color).multiplyScalar(P),U.groundColor.copy(M.groundColor).multiplyScalar(P),n.hemi[m]=U,m++}}f>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=p;const w=n.hash;(w.directionalLength!==h||w.pointLength!==g||w.spotLength!==A||w.rectAreaLength!==f||w.hemiLength!==m||w.numDirectionalShadows!==x||w.numPointShadows!==v||w.numSpotShadows!==y||w.numSpotMaps!==T||w.numLightProbes!==_)&&(n.directional.length=h,n.spot.length=A,n.rectArea.length=f,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+T-E,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=_,w.directionalLength=h,w.pointLength=g,w.spotLength=A,w.rectAreaLength=f,w.hemiLength=m,w.numDirectionalShadows=x,w.numPointShadows=v,w.numSpotShadows=y,w.numSpotMaps=T,w.numLightProbes=_,n.version=sg++)}function l(c,u){let d=0,p=0,h=0,g=0,A=0;const f=u.matrixWorldInverse;for(let m=0,x=c.length;m<x;m++){const v=c[m];if(v.isDirectionalLight){const y=n.directional[d];y.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(f),d++}else if(v.isSpotLight){const y=n.spot[h];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(f),y.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(f),h++}else if(v.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(f),a.identity(),r.copy(v.matrixWorld),r.premultiply(f),a.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){const y=n.point[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(f),p++}else if(v.isHemisphereLight){const y=n.hemi[A];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(f),A++}}}return{setup:o,setupView:l,state:n}}function Ll(s){const e=new ag(s),t=[],n=[];function i(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function og(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new Ll(s),e.set(i,[o])):r>=a.length?(o=new Ll(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class lg extends yr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Uu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class cg extends yr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const ug=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function hg(s,e,t){let n=new Nc;const i=new Me,r=new Me,a=new ft,o=new lg({depthPacking:Ou}),l=new cg,c={},u=t.maxTextureSize,d={[An]:Gt,[Gt]:An,[tn]:tn},p=new jt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Me},radius:{value:4}},vertexShader:ug,fragmentShader:dg}),h=p.clone();h.defines.HORIZONTAL_PASS=1;const g=new an;g.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const A=new St(g,p),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hc;let m=this.type;this.render=function(E,_,w){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||E.length===0)return;const O=s.getRenderTarget(),S=s.getActiveCubeFace(),M=s.getActiveMipmapLevel(),F=s.state;F.setBlending(Xn),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const P=m!==bn&&this.type===bn,D=m===bn&&this.type!==bn;for(let z=0,U=E.length;z<U;z++){const G=E[z],H=G.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",G,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const Y=H.getFrameExtents();if(i.multiply(Y),r.copy(H.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/Y.x),i.x=r.x*Y.x,H.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/Y.y),i.y=r.y*Y.y,H.mapSize.y=r.y)),H.map===null||P===!0||D===!0){const le=this.type!==bn?{minFilter:Vt,magFilter:Vt}:{};H.map!==null&&H.map.dispose(),H.map=new Yn(i.x,i.y,le),H.map.texture.name=G.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const ne=H.getViewportCount();for(let le=0;le<ne;le++){const Be=H.getViewport(le);a.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),F.viewport(a),H.updateMatrices(G,le),n=H.getFrustum(),y(_,w,H.camera,G,this.type)}H.isPointLightShadow!==!0&&this.type===bn&&x(H,w),H.needsUpdate=!1}m=this.type,f.needsUpdate=!1,s.setRenderTarget(O,S,M)};function x(E,_){const w=e.update(A);p.defines.VSM_SAMPLES!==E.blurSamples&&(p.defines.VSM_SAMPLES=E.blurSamples,h.defines.VSM_SAMPLES=E.blurSamples,p.needsUpdate=!0,h.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Yn(i.x,i.y)),p.uniforms.shadow_pass.value=E.map.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(_,null,w,p,A,null),h.uniforms.shadow_pass.value=E.mapPass.texture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(_,null,w,h,A,null)}function v(E,_,w,O){let S=null;const M=w.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(M!==void 0)S=M;else if(S=w.isPointLight===!0?l:o,s.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0){const F=S.uuid,P=_.uuid;let D=c[F];D===void 0&&(D={},c[F]=D);let z=D[P];z===void 0&&(z=S.clone(),D[P]=z,_.addEventListener("dispose",T)),S=z}if(S.visible=_.visible,S.wireframe=_.wireframe,O===bn?S.side=_.shadowSide!==null?_.shadowSide:_.side:S.side=_.shadowSide!==null?_.shadowSide:d[_.side],S.alphaMap=_.alphaMap,S.alphaTest=_.alphaTest,S.map=_.map,S.clipShadows=_.clipShadows,S.clippingPlanes=_.clippingPlanes,S.clipIntersection=_.clipIntersection,S.displacementMap=_.displacementMap,S.displacementScale=_.displacementScale,S.displacementBias=_.displacementBias,S.wireframeLinewidth=_.wireframeLinewidth,S.linewidth=_.linewidth,w.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=s.properties.get(S);F.light=w}return S}function y(E,_,w,O,S){if(E.visible===!1)return;if(E.layers.test(_.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&S===bn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,E.matrixWorld);const P=e.update(E),D=E.material;if(Array.isArray(D)){const z=P.groups;for(let U=0,G=z.length;U<G;U++){const H=z[U],Y=D[H.materialIndex];if(Y&&Y.visible){const ne=v(E,Y,O,S);E.onBeforeShadow(s,E,_,w,P,ne,H),s.renderBufferDirect(w,null,P,ne,E,H),E.onAfterShadow(s,E,_,w,P,ne,H)}}}else if(D.visible){const z=v(E,D,O,S);E.onBeforeShadow(s,E,_,w,P,z,null),s.renderBufferDirect(w,null,P,z,E,null),E.onAfterShadow(s,E,_,w,P,z,null)}}const F=E.children;for(let P=0,D=F.length;P<D;P++)y(F[P],_,w,O,S)}function T(E){E.target.removeEventListener("dispose",T);for(const w in c){const O=c[w],S=E.target.uuid;S in O&&(O[S].dispose(),delete O[S])}}}const fg={[pa]:ma,[ga]:xa,[Aa]:va,[Gi]:Sa,[ma]:pa,[xa]:ga,[va]:Aa,[Sa]:Gi};function pg(s){function e(){let N=!1;const Se=new ft;let K=null;const J=new ft(0,0,0,0);return{setMask:function(he){K!==he&&!N&&(s.colorMask(he,he,he,he),K=he)},setLocked:function(he){N=he},setClear:function(he,me,qe,at,yt){yt===!0&&(he*=at,me*=at,qe*=at),Se.set(he,me,qe,at),J.equals(Se)===!1&&(s.clearColor(he,me,qe,at),J.copy(Se))},reset:function(){N=!1,K=null,J.set(-1,0,0,0)}}}function t(){let N=!1,Se=!1,K=null,J=null,he=null;return{setReversed:function(me){Se=me},setTest:function(me){me?re(s.DEPTH_TEST):ae(s.DEPTH_TEST)},setMask:function(me){K!==me&&!N&&(s.depthMask(me),K=me)},setFunc:function(me){if(Se&&(me=fg[me]),J!==me){switch(me){case pa:s.depthFunc(s.NEVER);break;case ma:s.depthFunc(s.ALWAYS);break;case ga:s.depthFunc(s.LESS);break;case Gi:s.depthFunc(s.LEQUAL);break;case Aa:s.depthFunc(s.EQUAL);break;case Sa:s.depthFunc(s.GEQUAL);break;case xa:s.depthFunc(s.GREATER);break;case va:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}J=me}},setLocked:function(me){N=me},setClear:function(me){he!==me&&(s.clearDepth(me),he=me)},reset:function(){N=!1,K=null,J=null,he=null}}}function n(){let N=!1,Se=null,K=null,J=null,he=null,me=null,qe=null,at=null,yt=null;return{setTest:function($e){N||($e?re(s.STENCIL_TEST):ae(s.STENCIL_TEST))},setMask:function($e){Se!==$e&&!N&&(s.stencilMask($e),Se=$e)},setFunc:function($e,zt,vn){(K!==$e||J!==zt||he!==vn)&&(s.stencilFunc($e,zt,vn),K=$e,J=zt,he=vn)},setOp:function($e,zt,vn){(me!==$e||qe!==zt||at!==vn)&&(s.stencilOp($e,zt,vn),me=$e,qe=zt,at=vn)},setLocked:function($e){N=$e},setClear:function($e){yt!==$e&&(s.clearStencil($e),yt=$e)},reset:function(){N=!1,Se=null,K=null,J=null,he=null,me=null,qe=null,at=null,yt=null}}}const i=new e,r=new t,a=new n,o=new WeakMap,l=new WeakMap;let c={},u={},d=new WeakMap,p=[],h=null,g=!1,A=null,f=null,m=null,x=null,v=null,y=null,T=null,E=new Ze(0,0,0),_=0,w=!1,O=null,S=null,M=null,F=null,P=null;const D=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,U=0;const G=s.getParameter(s.VERSION);G.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(G)[1]),z=U>=1):G.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),z=U>=2);let H=null,Y={};const ne=s.getParameter(s.SCISSOR_BOX),le=s.getParameter(s.VIEWPORT),Be=new ft().fromArray(ne),Re=new ft().fromArray(le);function X(N,Se,K,J){const he=new Uint8Array(4),me=s.createTexture();s.bindTexture(N,me),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let qe=0;qe<K;qe++)N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY?s.texImage3D(Se,0,s.RGBA,1,1,J,0,s.RGBA,s.UNSIGNED_BYTE,he):s.texImage2D(Se+qe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,he);return me}const $={};$[s.TEXTURE_2D]=X(s.TEXTURE_2D,s.TEXTURE_2D,1),$[s.TEXTURE_CUBE_MAP]=X(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[s.TEXTURE_2D_ARRAY]=X(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),$[s.TEXTURE_3D]=X(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),a.setClear(0),re(s.DEPTH_TEST),r.setFunc(Gi),Ce(!1),Ge(Ho),re(s.CULL_FACE),L(Xn);function re(N){c[N]!==!0&&(s.enable(N),c[N]=!0)}function ae(N){c[N]!==!1&&(s.disable(N),c[N]=!1)}function ye(N,Se){return u[N]!==Se?(s.bindFramebuffer(N,Se),u[N]=Se,N===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=Se),N===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=Se),!0):!1}function Ae(N,Se){let K=p,J=!1;if(N){K=d.get(Se),K===void 0&&(K=[],d.set(Se,K));const he=N.textures;if(K.length!==he.length||K[0]!==s.COLOR_ATTACHMENT0){for(let me=0,qe=he.length;me<qe;me++)K[me]=s.COLOR_ATTACHMENT0+me;K.length=he.length,J=!0}}else K[0]!==s.BACK&&(K[0]=s.BACK,J=!0);J&&s.drawBuffers(K)}function Ie(N){return h!==N?(s.useProgram(N),h=N,!0):!1}const He={[si]:s.FUNC_ADD,[cu]:s.FUNC_SUBTRACT,[uu]:s.FUNC_REVERSE_SUBTRACT};He[du]=s.MIN,He[hu]=s.MAX;const Oe={[fu]:s.ZERO,[pu]:s.ONE,[mu]:s.SRC_COLOR,[ps]:s.SRC_ALPHA,[_u]:s.SRC_ALPHA_SATURATE,[xu]:s.DST_COLOR,[Au]:s.DST_ALPHA,[gu]:s.ONE_MINUS_SRC_COLOR,[ms]:s.ONE_MINUS_SRC_ALPHA,[vu]:s.ONE_MINUS_DST_COLOR,[Su]:s.ONE_MINUS_DST_ALPHA,[yu]:s.CONSTANT_COLOR,[Mu]:s.ONE_MINUS_CONSTANT_COLOR,[Cu]:s.CONSTANT_ALPHA,[Eu]:s.ONE_MINUS_CONSTANT_ALPHA};function L(N,Se,K,J,he,me,qe,at,yt,$e){if(N===Xn){g===!0&&(ae(s.BLEND),g=!1);return}if(g===!1&&(re(s.BLEND),g=!0),N!==fc){if(N!==A||$e!==w){if((f!==si||v!==si)&&(s.blendEquation(s.FUNC_ADD),f=si,v=si),$e)switch(N){case qn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Vo:s.blendFunc(s.ONE,s.ONE);break;case Go:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Wo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case qn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Vo:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Go:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Wo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}m=null,x=null,y=null,T=null,E.set(0,0,0),_=0,A=N,w=$e}return}he=he||Se,me=me||K,qe=qe||J,(Se!==f||he!==v)&&(s.blendEquationSeparate(He[Se],He[he]),f=Se,v=he),(K!==m||J!==x||me!==y||qe!==T)&&(s.blendFuncSeparate(Oe[K],Oe[J],Oe[me],Oe[qe]),m=K,x=J,y=me,T=qe),(at.equals(E)===!1||yt!==_)&&(s.blendColor(at.r,at.g,at.b,yt),E.copy(at),_=yt),A=N,w=!1}function Ke(N,Se){N.side===tn?ae(s.CULL_FACE):re(s.CULL_FACE);let K=N.side===Gt;Se&&(K=!K),Ce(K),N.blending===qn&&N.transparent===!1?L(Xn):L(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),r.setFunc(N.depthFunc),r.setTest(N.depthTest),r.setMask(N.depthWrite),i.setMask(N.colorWrite);const J=N.stencilWrite;a.setTest(J),J&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),We(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?re(s.SAMPLE_ALPHA_TO_COVERAGE):ae(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(N){O!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),O=N)}function Ge(N){N!==au?(re(s.CULL_FACE),N!==S&&(N===Ho?s.cullFace(s.BACK):N===ou?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ae(s.CULL_FACE),S=N}function Pe(N){N!==M&&(z&&s.lineWidth(N),M=N)}function We(N,Se,K){N?(re(s.POLYGON_OFFSET_FILL),(F!==Se||P!==K)&&(s.polygonOffset(Se,K),F=Se,P=K)):ae(s.POLYGON_OFFSET_FILL)}function be(N){N?re(s.SCISSOR_TEST):ae(s.SCISSOR_TEST)}function R(N){N===void 0&&(N=s.TEXTURE0+D-1),H!==N&&(s.activeTexture(N),H=N)}function C(N,Se,K){K===void 0&&(H===null?K=s.TEXTURE0+D-1:K=H);let J=Y[K];J===void 0&&(J={type:void 0,texture:void 0},Y[K]=J),(J.type!==N||J.texture!==Se)&&(H!==K&&(s.activeTexture(K),H=K),s.bindTexture(N,Se||$[N]),J.type=N,J.texture=Se)}function W(){const N=Y[H];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function ee(){try{s.compressedTexImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function se(){try{s.compressedTexImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function te(){try{s.texSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function we(){try{s.texSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function fe(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ye(){try{s.texStorage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function oe(){try{s.texStorage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xe(){try{s.texImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function B(){try{s.texImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ie(N){Be.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),Be.copy(N))}function ce(N){Re.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),Re.copy(N))}function Ue(N,Se){let K=l.get(Se);K===void 0&&(K=new WeakMap,l.set(Se,K));let J=K.get(N);J===void 0&&(J=s.getUniformBlockIndex(Se,N.name),K.set(N,J))}function De(N,Se){const J=l.get(Se).get(N);o.get(Se)!==J&&(s.uniformBlockBinding(Se,J,N.__bindingPointIndex),o.set(Se,J))}function je(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),c={},H=null,Y={},u={},d=new WeakMap,p=[],h=null,g=!1,A=null,f=null,m=null,x=null,v=null,y=null,T=null,E=new Ze(0,0,0),_=0,w=!1,O=null,S=null,M=null,F=null,P=null,Be.set(0,0,s.canvas.width,s.canvas.height),Re.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),a.reset()}return{buffers:{color:i,depth:r,stencil:a},enable:re,disable:ae,bindFramebuffer:ye,drawBuffers:Ae,useProgram:Ie,setBlending:L,setMaterial:Ke,setFlipSided:Ce,setCullFace:Ge,setLineWidth:Pe,setPolygonOffset:We,setScissorTest:be,activeTexture:R,bindTexture:C,unbindTexture:W,compressedTexImage2D:ee,compressedTexImage3D:se,texImage2D:xe,texImage3D:B,updateUBOMapping:Ue,uniformBlockBinding:De,texStorage2D:Ye,texStorage3D:oe,texSubImage2D:te,texSubImage3D:we,compressedTexSubImage2D:fe,compressedTexSubImage3D:ve,scissor:ie,viewport:ce,reset:je}}function Bl(s,e,t,n){const i=mg(n);switch(t){case xc:return s*e;case _c:return s*e;case yc:return s*e*2;case Mc:return s*e/i.components*i.byteLength;case xr:return s*e/i.components*i.byteLength;case Cc:return s*e*2/i.components*i.byteLength;case co:return s*e*2/i.components*i.byteLength;case vc:return s*e*3/i.components*i.byteLength;case Ot:return s*e*4/i.components*i.byteLength;case Ni:return s*e*4/i.components*i.byteLength;case er:case tr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case nr:case ir:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ta:case wa:return Math.max(s,16)*Math.max(e,8)/4;case Ea:case ba:return Math.max(s,8)*Math.max(e,8)/2;case Ra:case Ia:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Pa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Da:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Fa:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case La:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Ba:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Ua:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Oa:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Na:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case za:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case ka:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Ha:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Va:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ga:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Wa:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Xa:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case sr:case qa:case Qa:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Ec:case Ya:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Ka:case ja:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mg(s){switch(s){case Sn:case gc:return{byteLength:1,components:1};case gs:case Ac:case Zi:return{byteLength:2,components:1};case oo:case lo:return{byteLength:2,components:4};case nn:case ao:case fn:return{byteLength:4,components:1};case Sc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function gg(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Me,u=new WeakMap;let d;const p=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,C){return h?new OffscreenCanvas(R,C):dr("canvas")}function A(R,C,W){let ee=1;const se=be(R);if((se.width>W||se.height>W)&&(ee=W/Math.max(se.width,se.height)),ee<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const te=Math.floor(ee*se.width),we=Math.floor(ee*se.height);d===void 0&&(d=g(te,we));const fe=C?g(te,we):d;return fe.width=te,fe.height=we,fe.getContext("2d").drawImage(R,0,0,te,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+te+"x"+we+")."),fe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),R;return R}function f(R){return R.generateMipmaps&&R.minFilter!==Vt&&R.minFilter!==dn}function m(R){s.generateMipmap(R)}function x(R,C,W,ee,se=!1){if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let te=C;if(C===s.RED&&(W===s.FLOAT&&(te=s.R32F),W===s.HALF_FLOAT&&(te=s.R16F),W===s.UNSIGNED_BYTE&&(te=s.R8)),C===s.RED_INTEGER&&(W===s.UNSIGNED_BYTE&&(te=s.R8UI),W===s.UNSIGNED_SHORT&&(te=s.R16UI),W===s.UNSIGNED_INT&&(te=s.R32UI),W===s.BYTE&&(te=s.R8I),W===s.SHORT&&(te=s.R16I),W===s.INT&&(te=s.R32I)),C===s.RG&&(W===s.FLOAT&&(te=s.RG32F),W===s.HALF_FLOAT&&(te=s.RG16F),W===s.UNSIGNED_BYTE&&(te=s.RG8)),C===s.RG_INTEGER&&(W===s.UNSIGNED_BYTE&&(te=s.RG8UI),W===s.UNSIGNED_SHORT&&(te=s.RG16UI),W===s.UNSIGNED_INT&&(te=s.RG32UI),W===s.BYTE&&(te=s.RG8I),W===s.SHORT&&(te=s.RG16I),W===s.INT&&(te=s.RG32I)),C===s.RGB_INTEGER&&(W===s.UNSIGNED_BYTE&&(te=s.RGB8UI),W===s.UNSIGNED_SHORT&&(te=s.RGB16UI),W===s.UNSIGNED_INT&&(te=s.RGB32UI),W===s.BYTE&&(te=s.RGB8I),W===s.SHORT&&(te=s.RGB16I),W===s.INT&&(te=s.RGB32I)),C===s.RGBA_INTEGER&&(W===s.UNSIGNED_BYTE&&(te=s.RGBA8UI),W===s.UNSIGNED_SHORT&&(te=s.RGBA16UI),W===s.UNSIGNED_INT&&(te=s.RGBA32UI),W===s.BYTE&&(te=s.RGBA8I),W===s.SHORT&&(te=s.RGBA16I),W===s.INT&&(te=s.RGBA32I)),C===s.RGB&&W===s.UNSIGNED_INT_5_9_9_9_REV&&(te=s.RGB9_E5),C===s.RGBA){const we=se?or:nt.getTransfer(ee);W===s.FLOAT&&(te=s.RGBA32F),W===s.HALF_FLOAT&&(te=s.RGBA16F),W===s.UNSIGNED_BYTE&&(te=we===lt?s.SRGB8_ALPHA8:s.RGBA8),W===s.UNSIGNED_SHORT_4_4_4_4&&(te=s.RGBA4),W===s.UNSIGNED_SHORT_5_5_5_1&&(te=s.RGB5_A1)}return(te===s.R16F||te===s.R32F||te===s.RG16F||te===s.RG32F||te===s.RGBA16F||te===s.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function v(R,C){let W;return R?C===null||C===nn||C===qi?W=s.DEPTH24_STENCIL8:C===fn?W=s.DEPTH32F_STENCIL8:C===gs&&(W=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===nn||C===qi?W=s.DEPTH_COMPONENT24:C===fn?W=s.DEPTH_COMPONENT32F:C===gs&&(W=s.DEPTH_COMPONENT16),W}function y(R,C){return f(R)===!0||R.isFramebufferTexture&&R.minFilter!==Vt&&R.minFilter!==dn?Math.log2(Math.max(C.width,C.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?C.mipmaps.length:1}function T(R){const C=R.target;C.removeEventListener("dispose",T),_(C),C.isVideoTexture&&u.delete(C)}function E(R){const C=R.target;C.removeEventListener("dispose",E),O(C)}function _(R){const C=n.get(R);if(C.__webglInit===void 0)return;const W=R.source,ee=p.get(W);if(ee){const se=ee[C.__cacheKey];se.usedTimes--,se.usedTimes===0&&w(R),Object.keys(ee).length===0&&p.delete(W)}n.remove(R)}function w(R){const C=n.get(R);s.deleteTexture(C.__webglTexture);const W=R.source,ee=p.get(W);delete ee[C.__cacheKey],a.memory.textures--}function O(R){const C=n.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(C.__webglFramebuffer[ee]))for(let se=0;se<C.__webglFramebuffer[ee].length;se++)s.deleteFramebuffer(C.__webglFramebuffer[ee][se]);else s.deleteFramebuffer(C.__webglFramebuffer[ee]);C.__webglDepthbuffer&&s.deleteRenderbuffer(C.__webglDepthbuffer[ee])}else{if(Array.isArray(C.__webglFramebuffer))for(let ee=0;ee<C.__webglFramebuffer.length;ee++)s.deleteFramebuffer(C.__webglFramebuffer[ee]);else s.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&s.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&s.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let ee=0;ee<C.__webglColorRenderbuffer.length;ee++)C.__webglColorRenderbuffer[ee]&&s.deleteRenderbuffer(C.__webglColorRenderbuffer[ee]);C.__webglDepthRenderbuffer&&s.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const W=R.textures;for(let ee=0,se=W.length;ee<se;ee++){const te=n.get(W[ee]);te.__webglTexture&&(s.deleteTexture(te.__webglTexture),a.memory.textures--),n.remove(W[ee])}n.remove(R)}let S=0;function M(){S=0}function F(){const R=S;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),S+=1,R}function P(R){const C=[];return C.push(R.wrapS),C.push(R.wrapT),C.push(R.wrapR||0),C.push(R.magFilter),C.push(R.minFilter),C.push(R.anisotropy),C.push(R.internalFormat),C.push(R.format),C.push(R.type),C.push(R.generateMipmaps),C.push(R.premultiplyAlpha),C.push(R.flipY),C.push(R.unpackAlignment),C.push(R.colorSpace),C.join()}function D(R,C){const W=n.get(R);if(R.isVideoTexture&&Pe(R),R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){const ee=R.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Re(W,R,C);return}}t.bindTexture(s.TEXTURE_2D,W.__webglTexture,s.TEXTURE0+C)}function z(R,C){const W=n.get(R);if(R.version>0&&W.__version!==R.version){Re(W,R,C);return}t.bindTexture(s.TEXTURE_2D_ARRAY,W.__webglTexture,s.TEXTURE0+C)}function U(R,C){const W=n.get(R);if(R.version>0&&W.__version!==R.version){Re(W,R,C);return}t.bindTexture(s.TEXTURE_3D,W.__webglTexture,s.TEXTURE0+C)}function G(R,C){const W=n.get(R);if(R.version>0&&W.__version!==R.version){X(W,R,C);return}t.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture,s.TEXTURE0+C)}const H={[Ma]:s.REPEAT,[li]:s.CLAMP_TO_EDGE,[Ca]:s.MIRRORED_REPEAT},Y={[Vt]:s.NEAREST,[Bu]:s.NEAREST_MIPMAP_NEAREST,[Cs]:s.NEAREST_MIPMAP_LINEAR,[dn]:s.LINEAR,[Rr]:s.LINEAR_MIPMAP_NEAREST,[ci]:s.LINEAR_MIPMAP_LINEAR},ne={[ku]:s.NEVER,[qu]:s.ALWAYS,[Hu]:s.LESS,[Tc]:s.LEQUAL,[Vu]:s.EQUAL,[Xu]:s.GEQUAL,[Gu]:s.GREATER,[Wu]:s.NOTEQUAL};function le(R,C){if(C.type===fn&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===dn||C.magFilter===Rr||C.magFilter===Cs||C.magFilter===ci||C.minFilter===dn||C.minFilter===Rr||C.minFilter===Cs||C.minFilter===ci)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,H[C.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,H[C.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,H[C.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,Y[C.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,Y[C.minFilter]),C.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,ne[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===Vt||C.minFilter!==Cs&&C.minFilter!==ci||C.type===fn&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");s.texParameterf(R,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,i.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function Be(R,C){let W=!1;R.__webglInit===void 0&&(R.__webglInit=!0,C.addEventListener("dispose",T));const ee=C.source;let se=p.get(ee);se===void 0&&(se={},p.set(ee,se));const te=P(C);if(te!==R.__cacheKey){se[te]===void 0&&(se[te]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,W=!0),se[te].usedTimes++;const we=se[R.__cacheKey];we!==void 0&&(se[R.__cacheKey].usedTimes--,we.usedTimes===0&&w(C)),R.__cacheKey=te,R.__webglTexture=se[te].texture}return W}function Re(R,C,W){let ee=s.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(ee=s.TEXTURE_2D_ARRAY),C.isData3DTexture&&(ee=s.TEXTURE_3D);const se=Be(R,C),te=C.source;t.bindTexture(ee,R.__webglTexture,s.TEXTURE0+W);const we=n.get(te);if(te.version!==we.__version||se===!0){t.activeTexture(s.TEXTURE0+W);const fe=nt.getPrimaries(nt.workingColorSpace),ve=C.colorSpace===Wn?null:nt.getPrimaries(C.colorSpace),Ye=C.colorSpace===Wn||fe===ve?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,C.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,C.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let oe=A(C.image,!1,i.maxTextureSize);oe=We(C,oe);const xe=r.convert(C.format,C.colorSpace),B=r.convert(C.type);let ie=x(C.internalFormat,xe,B,C.colorSpace,C.isVideoTexture);le(ee,C);let ce;const Ue=C.mipmaps,De=C.isVideoTexture!==!0,je=we.__version===void 0||se===!0,N=te.dataReady,Se=y(C,oe);if(C.isDepthTexture)ie=v(C.format===Qi,C.type),je&&(De?t.texStorage2D(s.TEXTURE_2D,1,ie,oe.width,oe.height):t.texImage2D(s.TEXTURE_2D,0,ie,oe.width,oe.height,0,xe,B,null));else if(C.isDataTexture)if(Ue.length>0){De&&je&&t.texStorage2D(s.TEXTURE_2D,Se,ie,Ue[0].width,Ue[0].height);for(let K=0,J=Ue.length;K<J;K++)ce=Ue[K],De?N&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,ce.width,ce.height,xe,B,ce.data):t.texImage2D(s.TEXTURE_2D,K,ie,ce.width,ce.height,0,xe,B,ce.data);C.generateMipmaps=!1}else De?(je&&t.texStorage2D(s.TEXTURE_2D,Se,ie,oe.width,oe.height),N&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,oe.width,oe.height,xe,B,oe.data)):t.texImage2D(s.TEXTURE_2D,0,ie,oe.width,oe.height,0,xe,B,oe.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){De&&je&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Se,ie,Ue[0].width,Ue[0].height,oe.depth);for(let K=0,J=Ue.length;K<J;K++)if(ce=Ue[K],C.format!==Ot)if(xe!==null)if(De){if(N)if(C.layerUpdates.size>0){const he=Bl(ce.width,ce.height,C.format,C.type);for(const me of C.layerUpdates){const qe=ce.data.subarray(me*he/ce.data.BYTES_PER_ELEMENT,(me+1)*he/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,me,ce.width,ce.height,1,xe,qe,0,0)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,ce.width,ce.height,oe.depth,xe,ce.data,0,0)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,K,ie,ce.width,ce.height,oe.depth,0,ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?N&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,ce.width,ce.height,oe.depth,xe,B,ce.data):t.texImage3D(s.TEXTURE_2D_ARRAY,K,ie,ce.width,ce.height,oe.depth,0,xe,B,ce.data)}else{De&&je&&t.texStorage2D(s.TEXTURE_2D,Se,ie,Ue[0].width,Ue[0].height);for(let K=0,J=Ue.length;K<J;K++)ce=Ue[K],C.format!==Ot?xe!==null?De?N&&t.compressedTexSubImage2D(s.TEXTURE_2D,K,0,0,ce.width,ce.height,xe,ce.data):t.compressedTexImage2D(s.TEXTURE_2D,K,ie,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?N&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,ce.width,ce.height,xe,B,ce.data):t.texImage2D(s.TEXTURE_2D,K,ie,ce.width,ce.height,0,xe,B,ce.data)}else if(C.isDataArrayTexture)if(De){if(je&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Se,ie,oe.width,oe.height,oe.depth),N)if(C.layerUpdates.size>0){const K=Bl(oe.width,oe.height,C.format,C.type);for(const J of C.layerUpdates){const he=oe.data.subarray(J*K/oe.data.BYTES_PER_ELEMENT,(J+1)*K/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,J,oe.width,oe.height,1,xe,B,he)}C.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,xe,B,oe.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ie,oe.width,oe.height,oe.depth,0,xe,B,oe.data);else if(C.isData3DTexture)De?(je&&t.texStorage3D(s.TEXTURE_3D,Se,ie,oe.width,oe.height,oe.depth),N&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,xe,B,oe.data)):t.texImage3D(s.TEXTURE_3D,0,ie,oe.width,oe.height,oe.depth,0,xe,B,oe.data);else if(C.isFramebufferTexture){if(je)if(De)t.texStorage2D(s.TEXTURE_2D,Se,ie,oe.width,oe.height);else{let K=oe.width,J=oe.height;for(let he=0;he<Se;he++)t.texImage2D(s.TEXTURE_2D,he,ie,K,J,0,xe,B,null),K>>=1,J>>=1}}else if(Ue.length>0){if(De&&je){const K=be(Ue[0]);t.texStorage2D(s.TEXTURE_2D,Se,ie,K.width,K.height)}for(let K=0,J=Ue.length;K<J;K++)ce=Ue[K],De?N&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,xe,B,ce):t.texImage2D(s.TEXTURE_2D,K,ie,xe,B,ce);C.generateMipmaps=!1}else if(De){if(je){const K=be(oe);t.texStorage2D(s.TEXTURE_2D,Se,ie,K.width,K.height)}N&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,xe,B,oe)}else t.texImage2D(s.TEXTURE_2D,0,ie,xe,B,oe);f(C)&&m(ee),we.__version=te.version,C.onUpdate&&C.onUpdate(C)}R.__version=C.version}function X(R,C,W){if(C.image.length!==6)return;const ee=Be(R,C),se=C.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+W);const te=n.get(se);if(se.version!==te.__version||ee===!0){t.activeTexture(s.TEXTURE0+W);const we=nt.getPrimaries(nt.workingColorSpace),fe=C.colorSpace===Wn?null:nt.getPrimaries(C.colorSpace),ve=C.colorSpace===Wn||we===fe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,C.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,C.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const Ye=C.isCompressedTexture||C.image[0].isCompressedTexture,oe=C.image[0]&&C.image[0].isDataTexture,xe=[];for(let J=0;J<6;J++)!Ye&&!oe?xe[J]=A(C.image[J],!0,i.maxCubemapSize):xe[J]=oe?C.image[J].image:C.image[J],xe[J]=We(C,xe[J]);const B=xe[0],ie=r.convert(C.format,C.colorSpace),ce=r.convert(C.type),Ue=x(C.internalFormat,ie,ce,C.colorSpace),De=C.isVideoTexture!==!0,je=te.__version===void 0||ee===!0,N=se.dataReady;let Se=y(C,B);le(s.TEXTURE_CUBE_MAP,C);let K;if(Ye){De&&je&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Se,Ue,B.width,B.height);for(let J=0;J<6;J++){K=xe[J].mipmaps;for(let he=0;he<K.length;he++){const me=K[he];C.format!==Ot?ie!==null?De?N&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,he,0,0,me.width,me.height,ie,me.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,he,Ue,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,he,0,0,me.width,me.height,ie,ce,me.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,he,Ue,me.width,me.height,0,ie,ce,me.data)}}}else{if(K=C.mipmaps,De&&je){K.length>0&&Se++;const J=be(xe[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Se,Ue,J.width,J.height)}for(let J=0;J<6;J++)if(oe){De?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,xe[J].width,xe[J].height,ie,ce,xe[J].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ue,xe[J].width,xe[J].height,0,ie,ce,xe[J].data);for(let he=0;he<K.length;he++){const qe=K[he].image[J].image;De?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,he+1,0,0,qe.width,qe.height,ie,ce,qe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,he+1,Ue,qe.width,qe.height,0,ie,ce,qe.data)}}else{De?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,ie,ce,xe[J]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ue,ie,ce,xe[J]);for(let he=0;he<K.length;he++){const me=K[he];De?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,he+1,0,0,ie,ce,me.image[J]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,he+1,Ue,ie,ce,me.image[J])}}}f(C)&&m(s.TEXTURE_CUBE_MAP),te.__version=se.version,C.onUpdate&&C.onUpdate(C)}R.__version=C.version}function $(R,C,W,ee,se,te){const we=r.convert(W.format,W.colorSpace),fe=r.convert(W.type),ve=x(W.internalFormat,we,fe,W.colorSpace);if(!n.get(C).__hasExternalTextures){const oe=Math.max(1,C.width>>te),xe=Math.max(1,C.height>>te);se===s.TEXTURE_3D||se===s.TEXTURE_2D_ARRAY?t.texImage3D(se,te,ve,oe,xe,C.depth,0,we,fe,null):t.texImage2D(se,te,ve,oe,xe,0,we,fe,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),Ge(C)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ee,se,n.get(W).__webglTexture,0,Ce(C)):(se===s.TEXTURE_2D||se>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ee,se,n.get(W).__webglTexture,te),t.bindFramebuffer(s.FRAMEBUFFER,null)}function re(R,C,W){if(s.bindRenderbuffer(s.RENDERBUFFER,R),C.depthBuffer){const ee=C.depthTexture,se=ee&&ee.isDepthTexture?ee.type:null,te=v(C.stencilBuffer,se),we=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,fe=Ce(C);Ge(C)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,fe,te,C.width,C.height):W?s.renderbufferStorageMultisample(s.RENDERBUFFER,fe,te,C.width,C.height):s.renderbufferStorage(s.RENDERBUFFER,te,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,we,s.RENDERBUFFER,R)}else{const ee=C.textures;for(let se=0;se<ee.length;se++){const te=ee[se],we=r.convert(te.format,te.colorSpace),fe=r.convert(te.type),ve=x(te.internalFormat,we,fe,te.colorSpace),Ye=Ce(C);W&&Ge(C)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ye,ve,C.width,C.height):Ge(C)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ye,ve,C.width,C.height):s.renderbufferStorage(s.RENDERBUFFER,ve,C.width,C.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ae(R,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(C.depthTexture).__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),D(C.depthTexture,0);const ee=n.get(C.depthTexture).__webglTexture,se=Ce(C);if(C.depthTexture.format===di)Ge(C)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ee,0,se):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ee,0);else if(C.depthTexture.format===Qi)Ge(C)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ee,0,se):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function ye(R){const C=n.get(R),W=R.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==R.depthTexture){const ee=R.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),ee){const se=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,ee.removeEventListener("dispose",se)};ee.addEventListener("dispose",se),C.__depthDisposeCallback=se}C.__boundDepthTexture=ee}if(R.depthTexture&&!C.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");ae(C.__webglFramebuffer,R)}else if(W){C.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer[ee]),C.__webglDepthbuffer[ee]===void 0)C.__webglDepthbuffer[ee]=s.createRenderbuffer(),re(C.__webglDepthbuffer[ee],R,!1);else{const se=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,te=C.__webglDepthbuffer[ee];s.bindRenderbuffer(s.RENDERBUFFER,te),s.framebufferRenderbuffer(s.FRAMEBUFFER,se,s.RENDERBUFFER,te)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=s.createRenderbuffer(),re(C.__webglDepthbuffer,R,!1);else{const ee=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,se=C.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,se),s.framebufferRenderbuffer(s.FRAMEBUFFER,ee,s.RENDERBUFFER,se)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ae(R,C,W){const ee=n.get(R);C!==void 0&&$(ee.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),W!==void 0&&ye(R)}function Ie(R){const C=R.texture,W=n.get(R),ee=n.get(C);R.addEventListener("dispose",E);const se=R.textures,te=R.isWebGLCubeRenderTarget===!0,we=se.length>1;if(we||(ee.__webglTexture===void 0&&(ee.__webglTexture=s.createTexture()),ee.__version=C.version,a.memory.textures++),te){W.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(C.mipmaps&&C.mipmaps.length>0){W.__webglFramebuffer[fe]=[];for(let ve=0;ve<C.mipmaps.length;ve++)W.__webglFramebuffer[fe][ve]=s.createFramebuffer()}else W.__webglFramebuffer[fe]=s.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){W.__webglFramebuffer=[];for(let fe=0;fe<C.mipmaps.length;fe++)W.__webglFramebuffer[fe]=s.createFramebuffer()}else W.__webglFramebuffer=s.createFramebuffer();if(we)for(let fe=0,ve=se.length;fe<ve;fe++){const Ye=n.get(se[fe]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=s.createTexture(),a.memory.textures++)}if(R.samples>0&&Ge(R)===!1){W.__webglMultisampledFramebuffer=s.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let fe=0;fe<se.length;fe++){const ve=se[fe];W.__webglColorRenderbuffer[fe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,W.__webglColorRenderbuffer[fe]);const Ye=r.convert(ve.format,ve.colorSpace),oe=r.convert(ve.type),xe=x(ve.internalFormat,Ye,oe,ve.colorSpace,R.isXRRenderTarget===!0),B=Ce(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,B,xe,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,W.__webglColorRenderbuffer[fe])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(W.__webglDepthRenderbuffer=s.createRenderbuffer(),re(W.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(te){t.bindTexture(s.TEXTURE_CUBE_MAP,ee.__webglTexture),le(s.TEXTURE_CUBE_MAP,C);for(let fe=0;fe<6;fe++)if(C.mipmaps&&C.mipmaps.length>0)for(let ve=0;ve<C.mipmaps.length;ve++)$(W.__webglFramebuffer[fe][ve],R,C,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,ve);else $(W.__webglFramebuffer[fe],R,C,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);f(C)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let fe=0,ve=se.length;fe<ve;fe++){const Ye=se[fe],oe=n.get(Ye);t.bindTexture(s.TEXTURE_2D,oe.__webglTexture),le(s.TEXTURE_2D,Ye),$(W.__webglFramebuffer,R,Ye,s.COLOR_ATTACHMENT0+fe,s.TEXTURE_2D,0),f(Ye)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let fe=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(fe=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(fe,ee.__webglTexture),le(fe,C),C.mipmaps&&C.mipmaps.length>0)for(let ve=0;ve<C.mipmaps.length;ve++)$(W.__webglFramebuffer[ve],R,C,s.COLOR_ATTACHMENT0,fe,ve);else $(W.__webglFramebuffer,R,C,s.COLOR_ATTACHMENT0,fe,0);f(C)&&m(fe),t.unbindTexture()}R.depthBuffer&&ye(R)}function He(R){const C=R.textures;for(let W=0,ee=C.length;W<ee;W++){const se=C[W];if(f(se)){const te=R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,we=n.get(se).__webglTexture;t.bindTexture(te,we),m(te),t.unbindTexture()}}}const Oe=[],L=[];function Ke(R){if(R.samples>0){if(Ge(R)===!1){const C=R.textures,W=R.width,ee=R.height;let se=s.COLOR_BUFFER_BIT;const te=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=n.get(R),fe=C.length>1;if(fe)for(let ve=0;ve<C.length;ve++)t.bindFramebuffer(s.FRAMEBUFFER,we.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,we.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let ve=0;ve<C.length;ve++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(se|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(se|=s.STENCIL_BUFFER_BIT)),fe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,we.__webglColorRenderbuffer[ve]);const Ye=n.get(C[ve]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ye,0)}s.blitFramebuffer(0,0,W,ee,0,0,W,ee,se,s.NEAREST),l===!0&&(Oe.length=0,L.length=0,Oe.push(s.COLOR_ATTACHMENT0+ve),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Oe.push(te),L.push(te),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,L)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Oe))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),fe)for(let ve=0;ve<C.length;ve++){t.bindFramebuffer(s.FRAMEBUFFER,we.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,we.__webglColorRenderbuffer[ve]);const Ye=n.get(C[ve]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,we.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,Ye,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const C=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[C])}}}function Ce(R){return Math.min(i.maxSamples,R.samples)}function Ge(R){const C=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Pe(R){const C=a.render.frame;u.get(R)!==C&&(u.set(R,C),R.update())}function We(R,C){const W=R.colorSpace,ee=R.format,se=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||W!==Kn&&W!==Wn&&(nt.getTransfer(W)===lt?(ee!==Ot||se!==Sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),C}function be(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=M,this.setTexture2D=D,this.setTexture2DArray=z,this.setTexture3D=U,this.setTextureCube=G,this.rebindTextures=Ae,this.setupRenderTarget=Ie,this.updateRenderTargetMipmap=He,this.updateMultisampleRenderTarget=Ke,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=$,this.useMultisampledRTT=Ge}function Wc(s,e){function t(n,i=Wn){let r;const a=nt.getTransfer(i);if(n===Sn)return s.UNSIGNED_BYTE;if(n===oo)return s.UNSIGNED_SHORT_4_4_4_4;if(n===lo)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Sc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===gc)return s.BYTE;if(n===Ac)return s.SHORT;if(n===gs)return s.UNSIGNED_SHORT;if(n===ao)return s.INT;if(n===nn)return s.UNSIGNED_INT;if(n===fn)return s.FLOAT;if(n===Zi)return s.HALF_FLOAT;if(n===xc)return s.ALPHA;if(n===vc)return s.RGB;if(n===Ot)return s.RGBA;if(n===_c)return s.LUMINANCE;if(n===yc)return s.LUMINANCE_ALPHA;if(n===di)return s.DEPTH_COMPONENT;if(n===Qi)return s.DEPTH_STENCIL;if(n===Mc)return s.RED;if(n===xr)return s.RED_INTEGER;if(n===Cc)return s.RG;if(n===co)return s.RG_INTEGER;if(n===Ni)return s.RGBA_INTEGER;if(n===er||n===tr||n===nr||n===ir)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===er)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===er)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===tr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===nr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ir)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ea||n===Ta||n===ba||n===wa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ea)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ta)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ba)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===wa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ra||n===Ia||n===Pa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ra||n===Ia)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Pa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Da||n===Fa||n===La||n===Ba||n===Ua||n===Oa||n===Na||n===za||n===ka||n===Ha||n===Va||n===Ga||n===Wa||n===Xa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Da)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===La)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ba)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ua)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Oa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Na)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===za)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ka)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ha)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Va)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ga)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xa)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===sr||n===qa||n===Qa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===sr)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===qa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Qa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ec||n===Ya||n===Ka||n===ja)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===sr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ya)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ka)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ja)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===qi?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class Ag extends en{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Xs extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Sg={type:"move"};class ia{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const A of e.hand.values()){const f=t.getJointPose(A,n),m=this._getHandJoint(c,A);f!==null&&(m.matrix.fromArray(f.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=f.radius),m.visible=f!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],p=u.position.distanceTo(d.position),h=.02,g=.005;c.inputState.pinching&&p>h+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=h-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Sg)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Xs;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const xg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class _g{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Nt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new jt({vertexShader:xg,fragmentShader:vg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new St(new Ki(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class yg extends fi{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,p=null,h=null,g=null;const A=new _g,f=t.getContextAttributes();let m=null,x=null;const v=[],y=[],T=new Me;let E=null;const _=new en;_.layers.enable(1),_.viewport=new ft;const w=new en;w.layers.enable(2),w.viewport=new ft;const O=[_,w],S=new Ag;S.layers.enable(1),S.layers.enable(2);let M=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let $=v[X];return $===void 0&&($=new ia,v[X]=$),$.getTargetRaySpace()},this.getControllerGrip=function(X){let $=v[X];return $===void 0&&($=new ia,v[X]=$),$.getGripSpace()},this.getHand=function(X){let $=v[X];return $===void 0&&($=new ia,v[X]=$),$.getHandSpace()};function P(X){const $=y.indexOf(X.inputSource);if($===-1)return;const re=v[$];re!==void 0&&(re.update(X.inputSource,X.frame,c||a),re.dispatchEvent({type:X.type,data:X.inputSource}))}function D(){i.removeEventListener("select",P),i.removeEventListener("selectstart",P),i.removeEventListener("selectend",P),i.removeEventListener("squeeze",P),i.removeEventListener("squeezestart",P),i.removeEventListener("squeezeend",P),i.removeEventListener("end",D),i.removeEventListener("inputsourceschange",z);for(let X=0;X<v.length;X++){const $=y[X];$!==null&&(y[X]=null,v[X].disconnect($))}M=null,F=null,A.reset(),e.setRenderTarget(m),h=null,p=null,d=null,i=null,x=null,Re.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return p!==null?p:h},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(X){if(i=X,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",P),i.addEventListener("selectstart",P),i.addEventListener("selectend",P),i.addEventListener("squeeze",P),i.addEventListener("squeezestart",P),i.addEventListener("squeezeend",P),i.addEventListener("end",D),i.addEventListener("inputsourceschange",z),f.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),i.renderState.layers===void 0){const $={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};h=new XRWebGLLayer(i,t,$),i.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),x=new Yn(h.framebufferWidth,h.framebufferHeight,{format:Ot,type:Sn,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let $=null,re=null,ae=null;f.depth&&(ae=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,$=f.stencil?Qi:di,re=f.stencil?qi:nn);const ye={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:r};d=new XRWebGLBinding(i,t),p=d.createProjectionLayer(ye),i.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),x=new Yn(p.textureWidth,p.textureHeight,{format:Ot,type:Sn,depthTexture:new go(p.textureWidth,p.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Re.setContext(i),Re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return A.getDepthTexture()};function z(X){for(let $=0;$<X.removed.length;$++){const re=X.removed[$],ae=y.indexOf(re);ae>=0&&(y[ae]=null,v[ae].disconnect(re))}for(let $=0;$<X.added.length;$++){const re=X.added[$];let ae=y.indexOf(re);if(ae===-1){for(let Ae=0;Ae<v.length;Ae++)if(Ae>=y.length){y.push(re),ae=Ae;break}else if(y[Ae]===null){y[Ae]=re,ae=Ae;break}if(ae===-1)break}const ye=v[ae];ye&&ye.connect(re)}}const U=new I,G=new I;function H(X,$,re){U.setFromMatrixPosition($.matrixWorld),G.setFromMatrixPosition(re.matrixWorld);const ae=U.distanceTo(G),ye=$.projectionMatrix.elements,Ae=re.projectionMatrix.elements,Ie=ye[14]/(ye[10]-1),He=ye[14]/(ye[10]+1),Oe=(ye[9]+1)/ye[5],L=(ye[9]-1)/ye[5],Ke=(ye[8]-1)/ye[0],Ce=(Ae[8]+1)/Ae[0],Ge=Ie*Ke,Pe=Ie*Ce,We=ae/(-Ke+Ce),be=We*-Ke;if($.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(be),X.translateZ(We),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),ye[10]===-1)X.projectionMatrix.copy($.projectionMatrix),X.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const R=Ie+We,C=He+We,W=Ge-be,ee=Pe+(ae-be),se=Oe*He/C*R,te=L*He/C*R;X.projectionMatrix.makePerspective(W,ee,se,te,R,C),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function Y(X,$){$===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices($.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(i===null)return;let $=X.near,re=X.far;A.texture!==null&&(A.depthNear>0&&($=A.depthNear),A.depthFar>0&&(re=A.depthFar)),S.near=w.near=_.near=$,S.far=w.far=_.far=re,(M!==S.near||F!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),M=S.near,F=S.far);const ae=X.parent,ye=S.cameras;Y(S,ae);for(let Ae=0;Ae<ye.length;Ae++)Y(ye[Ae],ae);ye.length===2?H(S,_,w):S.projectionMatrix.copy(_.projectionMatrix),ne(X,S,ae)};function ne(X,$,re){re===null?X.matrix.copy($.matrixWorld):(X.matrix.copy(re.matrixWorld),X.matrix.invert(),X.matrix.multiply($.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy($.projectionMatrix),X.projectionMatrixInverse.copy($.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=As*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(p===null&&h===null))return l},this.setFoveation=function(X){l=X,p!==null&&(p.fixedFoveation=X),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=X)},this.hasDepthSensing=function(){return A.texture!==null},this.getDepthSensingMesh=function(){return A.getMesh(S)};let le=null;function Be(X,$){if(u=$.getViewerPose(c||a),g=$,u!==null){const re=u.views;h!==null&&(e.setRenderTargetFramebuffer(x,h.framebuffer),e.setRenderTarget(x));let ae=!1;re.length!==S.cameras.length&&(S.cameras.length=0,ae=!0);for(let Ae=0;Ae<re.length;Ae++){const Ie=re[Ae];let He=null;if(h!==null)He=h.getViewport(Ie);else{const L=d.getViewSubImage(p,Ie);He=L.viewport,Ae===0&&(e.setRenderTargetTextures(x,L.colorTexture,p.ignoreDepthValues?void 0:L.depthStencilTexture),e.setRenderTarget(x))}let Oe=O[Ae];Oe===void 0&&(Oe=new en,Oe.layers.enable(Ae),Oe.viewport=new ft,O[Ae]=Oe),Oe.matrix.fromArray(Ie.transform.matrix),Oe.matrix.decompose(Oe.position,Oe.quaternion,Oe.scale),Oe.projectionMatrix.fromArray(Ie.projectionMatrix),Oe.projectionMatrixInverse.copy(Oe.projectionMatrix).invert(),Oe.viewport.set(He.x,He.y,He.width,He.height),Ae===0&&(S.matrix.copy(Oe.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ae===!0&&S.cameras.push(Oe)}const ye=i.enabledFeatures;if(ye&&ye.includes("depth-sensing")){const Ae=d.getDepthInformation(re[0]);Ae&&Ae.isValid&&Ae.texture&&A.init(e,Ae,i.renderState)}}for(let re=0;re<v.length;re++){const ae=y[re],ye=v[re];ae!==null&&ye!==void 0&&ye.update(ae,$,c||a)}le&&le(X,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),g=null}const Re=new zc;Re.setAnimationLoop(Be),this.setAnimationLoop=function(X){le=X},this.dispose=function(){}}}const ni=new xn,Mg=new ke;function Cg(s,e){function t(f,m){f.matrixAutoUpdate===!0&&f.updateMatrix(),m.value.copy(f.matrix)}function n(f,m){m.color.getRGB(f.fogColor.value,Bc(s)),m.isFog?(f.fogNear.value=m.near,f.fogFar.value=m.far):m.isFogExp2&&(f.fogDensity.value=m.density)}function i(f,m,x,v,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(f,m):m.isMeshToonMaterial?(r(f,m),d(f,m)):m.isMeshPhongMaterial?(r(f,m),u(f,m)):m.isMeshStandardMaterial?(r(f,m),p(f,m),m.isMeshPhysicalMaterial&&h(f,m,y)):m.isMeshMatcapMaterial?(r(f,m),g(f,m)):m.isMeshDepthMaterial?r(f,m):m.isMeshDistanceMaterial?(r(f,m),A(f,m)):m.isMeshNormalMaterial?r(f,m):m.isLineBasicMaterial?(a(f,m),m.isLineDashedMaterial&&o(f,m)):m.isPointsMaterial?l(f,m,x,v):m.isSpriteMaterial?c(f,m):m.isShadowMaterial?(f.color.value.copy(m.color),f.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(f,m){f.opacity.value=m.opacity,m.color&&f.diffuse.value.copy(m.color),m.emissive&&f.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(f.map.value=m.map,t(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.bumpMap&&(f.bumpMap.value=m.bumpMap,t(m.bumpMap,f.bumpMapTransform),f.bumpScale.value=m.bumpScale,m.side===Gt&&(f.bumpScale.value*=-1)),m.normalMap&&(f.normalMap.value=m.normalMap,t(m.normalMap,f.normalMapTransform),f.normalScale.value.copy(m.normalScale),m.side===Gt&&f.normalScale.value.negate()),m.displacementMap&&(f.displacementMap.value=m.displacementMap,t(m.displacementMap,f.displacementMapTransform),f.displacementScale.value=m.displacementScale,f.displacementBias.value=m.displacementBias),m.emissiveMap&&(f.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,f.emissiveMapTransform)),m.specularMap&&(f.specularMap.value=m.specularMap,t(m.specularMap,f.specularMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest);const x=e.get(m),v=x.envMap,y=x.envMapRotation;v&&(f.envMap.value=v,ni.copy(y),ni.x*=-1,ni.y*=-1,ni.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ni.y*=-1,ni.z*=-1),f.envMapRotation.value.setFromMatrix4(Mg.makeRotationFromEuler(ni)),f.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=m.reflectivity,f.ior.value=m.ior,f.refractionRatio.value=m.refractionRatio),m.lightMap&&(f.lightMap.value=m.lightMap,f.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,f.lightMapTransform)),m.aoMap&&(f.aoMap.value=m.aoMap,f.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,f.aoMapTransform))}function a(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,m.map&&(f.map.value=m.map,t(m.map,f.mapTransform))}function o(f,m){f.dashSize.value=m.dashSize,f.totalSize.value=m.dashSize+m.gapSize,f.scale.value=m.scale}function l(f,m,x,v){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.size.value=m.size*x,f.scale.value=v*.5,m.map&&(f.map.value=m.map,t(m.map,f.uvTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function c(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.rotation.value=m.rotation,m.map&&(f.map.value=m.map,t(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function u(f,m){f.specular.value.copy(m.specular),f.shininess.value=Math.max(m.shininess,1e-4)}function d(f,m){m.gradientMap&&(f.gradientMap.value=m.gradientMap)}function p(f,m){f.metalness.value=m.metalness,m.metalnessMap&&(f.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,f.metalnessMapTransform)),f.roughness.value=m.roughness,m.roughnessMap&&(f.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,f.roughnessMapTransform)),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)}function h(f,m,x){f.ior.value=m.ior,m.sheen>0&&(f.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),f.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(f.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,f.sheenColorMapTransform)),m.sheenRoughnessMap&&(f.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,f.sheenRoughnessMapTransform))),m.clearcoat>0&&(f.clearcoat.value=m.clearcoat,f.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(f.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,f.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(f.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Gt&&f.clearcoatNormalScale.value.negate())),m.dispersion>0&&(f.dispersion.value=m.dispersion),m.iridescence>0&&(f.iridescence.value=m.iridescence,f.iridescenceIOR.value=m.iridescenceIOR,f.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(f.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,f.iridescenceMapTransform)),m.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),m.transmission>0&&(f.transmission.value=m.transmission,f.transmissionSamplerMap.value=x.texture,f.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(f.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,f.transmissionMapTransform)),f.thickness.value=m.thickness,m.thicknessMap&&(f.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=m.attenuationDistance,f.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(f.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(f.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=m.specularIntensity,f.specularColor.value.copy(m.specularColor),m.specularColorMap&&(f.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,f.specularColorMapTransform)),m.specularIntensityMap&&(f.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,m){m.matcap&&(f.matcap.value=m.matcap)}function A(f,m){const x=e.get(m).light;f.referencePosition.value.setFromMatrixPosition(x.matrixWorld),f.nearDistance.value=x.shadow.camera.near,f.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Eg(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,v){const y=v.program;n.uniformBlockBinding(x,y)}function c(x,v){let y=i[x.id];y===void 0&&(g(x),y=u(x),i[x.id]=y,x.addEventListener("dispose",f));const T=v.program;n.updateUBOMapping(x,T);const E=e.render.frame;r[x.id]!==E&&(p(x),r[x.id]=E)}function u(x){const v=d();x.__bindingPointIndex=v;const y=s.createBuffer(),T=x.__size,E=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,T,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,y),y}function d(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const v=i[x.id],y=x.uniforms,T=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let E=0,_=y.length;E<_;E++){const w=Array.isArray(y[E])?y[E]:[y[E]];for(let O=0,S=w.length;O<S;O++){const M=w[O];if(h(M,E,O,T)===!0){const F=M.__offset,P=Array.isArray(M.value)?M.value:[M.value];let D=0;for(let z=0;z<P.length;z++){const U=P[z],G=A(U);typeof U=="number"||typeof U=="boolean"?(M.__data[0]=U,s.bufferSubData(s.UNIFORM_BUFFER,F+D,M.__data)):U.isMatrix3?(M.__data[0]=U.elements[0],M.__data[1]=U.elements[1],M.__data[2]=U.elements[2],M.__data[3]=0,M.__data[4]=U.elements[3],M.__data[5]=U.elements[4],M.__data[6]=U.elements[5],M.__data[7]=0,M.__data[8]=U.elements[6],M.__data[9]=U.elements[7],M.__data[10]=U.elements[8],M.__data[11]=0):(U.toArray(M.__data,D),D+=G.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,M.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function h(x,v,y,T){const E=x.value,_=v+"_"+y;if(T[_]===void 0)return typeof E=="number"||typeof E=="boolean"?T[_]=E:T[_]=E.clone(),!0;{const w=T[_];if(typeof E=="number"||typeof E=="boolean"){if(w!==E)return T[_]=E,!0}else if(w.equals(E)===!1)return w.copy(E),!0}return!1}function g(x){const v=x.uniforms;let y=0;const T=16;for(let _=0,w=v.length;_<w;_++){const O=Array.isArray(v[_])?v[_]:[v[_]];for(let S=0,M=O.length;S<M;S++){const F=O[S],P=Array.isArray(F.value)?F.value:[F.value];for(let D=0,z=P.length;D<z;D++){const U=P[D],G=A(U),H=y%T,Y=H%G.boundary,ne=H+Y;y+=Y,ne!==0&&T-ne<G.storage&&(y+=T-ne),F.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=G.storage}}}const E=y%T;return E>0&&(y+=T-E),x.__size=y,x.__cache={},this}function A(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function f(x){const v=x.target;v.removeEventListener("dispose",f);const y=a.indexOf(v.__bindingPointIndex);a.splice(y,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function m(){for(const x in i)s.deleteBuffer(i[x]);a=[],i={},r={}}return{bind:l,update:c,dispose:m}}class Tg{constructor(e={}){const{canvas:t=ud(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const h=new Uint32Array(4),g=new Int32Array(4);let A=null,f=null;const m=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=pn,this.toneMapping=Qn,this.toneMappingExposure=1;const v=this;let y=!1,T=0,E=0,_=null,w=-1,O=null;const S=new ft,M=new ft;let F=null;const P=new Ze(0);let D=0,z=t.width,U=t.height,G=1,H=null,Y=null;const ne=new ft(0,0,z,U),le=new ft(0,0,z,U);let Be=!1;const Re=new Nc;let X=!1,$=!1;const re=new ke,ae=new ke,ye=new I,Ae=new ft,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let He=!1;function Oe(){return _===null?G:1}let L=n;function Ke(b,k){return t.getContext(b,k)}try{const b={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ro}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",he,!1),t.addEventListener("webglcontextcreationerror",me,!1),L===null){const k="webgl2";if(L=Ke(k,b),L===null)throw Ke(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Ce,Ge,Pe,We,be,R,C,W,ee,se,te,we,fe,ve,Ye,oe,xe,B,ie,ce,Ue,De,je,N;function Se(){Ce=new Dp(L),Ce.init(),De=new Wc(L,Ce),Ge=new Tp(L,Ce,e,De),Pe=new pg(L),Ge.reverseDepthBuffer&&Pe.buffers.depth.setReversed(!0),We=new Bp(L),be=new Jm,R=new gg(L,Ce,Pe,be,Ge,De,We),C=new wp(v),W=new Pp(v),ee=new Hd(L),je=new Cp(L,ee),se=new Fp(L,ee,We,je),te=new Op(L,se,ee,We),ie=new Up(L,Ge,R),oe=new bp(be),we=new $m(v,C,W,Ce,Ge,je,oe),fe=new Cg(v,be),ve=new tg,Ye=new og(Ce),B=new Mp(v,C,W,Pe,te,p,l),xe=new hg(v,te,Ge),N=new Eg(L,We,Ge,Pe),ce=new Ep(L,Ce,We),Ue=new Lp(L,Ce,We),We.programs=we.programs,v.capabilities=Ge,v.extensions=Ce,v.properties=be,v.renderLists=ve,v.shadowMap=xe,v.state=Pe,v.info=We}Se();const K=new yg(v,L);this.xr=K,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const b=Ce.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Ce.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(b){b!==void 0&&(G=b,this.setSize(z,U,!1))},this.getSize=function(b){return b.set(z,U)},this.setSize=function(b,k,q=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=b,U=k,t.width=Math.floor(b*G),t.height=Math.floor(k*G),q===!0&&(t.style.width=b+"px",t.style.height=k+"px"),this.setViewport(0,0,b,k)},this.getDrawingBufferSize=function(b){return b.set(z*G,U*G).floor()},this.setDrawingBufferSize=function(b,k,q){z=b,U=k,G=q,t.width=Math.floor(b*q),t.height=Math.floor(k*q),this.setViewport(0,0,b,k)},this.getCurrentViewport=function(b){return b.copy(S)},this.getViewport=function(b){return b.copy(ne)},this.setViewport=function(b,k,q,Q){b.isVector4?ne.set(b.x,b.y,b.z,b.w):ne.set(b,k,q,Q),Pe.viewport(S.copy(ne).multiplyScalar(G).round())},this.getScissor=function(b){return b.copy(le)},this.setScissor=function(b,k,q,Q){b.isVector4?le.set(b.x,b.y,b.z,b.w):le.set(b,k,q,Q),Pe.scissor(M.copy(le).multiplyScalar(G).round())},this.getScissorTest=function(){return Be},this.setScissorTest=function(b){Pe.setScissorTest(Be=b)},this.setOpaqueSort=function(b){H=b},this.setTransparentSort=function(b){Y=b},this.getClearColor=function(b){return b.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(b=!0,k=!0,q=!0){let Q=0;if(b){let V=!1;if(_!==null){const ue=_.texture.format;V=ue===Ni||ue===co||ue===xr}if(V){const ue=_.texture.type,ge=ue===Sn||ue===nn||ue===gs||ue===qi||ue===oo||ue===lo,Ee=B.getClearColor(),Te=B.getClearAlpha(),Ne=Ee.r,Ve=Ee.g,Fe=Ee.b;ge?(h[0]=Ne,h[1]=Ve,h[2]=Fe,h[3]=Te,L.clearBufferuiv(L.COLOR,0,h)):(g[0]=Ne,g[1]=Ve,g[2]=Fe,g[3]=Te,L.clearBufferiv(L.COLOR,0,g))}else Q|=L.COLOR_BUFFER_BIT}k&&(Q|=L.DEPTH_BUFFER_BIT,L.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),q&&(Q|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",he,!1),t.removeEventListener("webglcontextcreationerror",me,!1),ve.dispose(),Ye.dispose(),be.dispose(),C.dispose(),W.dispose(),te.dispose(),je.dispose(),N.dispose(),we.dispose(),K.dispose(),K.removeEventListener("sessionstart",Fo),K.removeEventListener("sessionend",Lo),jn.stop()};function J(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function he(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const b=We.autoReset,k=xe.enabled,q=xe.autoUpdate,Q=xe.needsUpdate,V=xe.type;Se(),We.autoReset=b,xe.enabled=k,xe.autoUpdate=q,xe.needsUpdate=Q,xe.type=V}function me(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function qe(b){const k=b.target;k.removeEventListener("dispose",qe),at(k)}function at(b){yt(b),be.remove(b)}function yt(b){const k=be.get(b).programs;k!==void 0&&(k.forEach(function(q){we.releaseProgram(q)}),b.isShaderMaterial&&we.releaseShaderCache(b))}this.renderBufferDirect=function(b,k,q,Q,V,ue){k===null&&(k=Ie);const ge=V.isMesh&&V.matrixWorld.determinant()<0,Ee=eu(b,k,q,Q,V);Pe.setMaterial(Q,ge);let Te=q.index,Ne=1;if(Q.wireframe===!0){if(Te=se.getWireframeAttribute(q),Te===void 0)return;Ne=2}const Ve=q.drawRange,Fe=q.attributes.position;let it=Ve.start*Ne,ot=(Ve.start+Ve.count)*Ne;ue!==null&&(it=Math.max(it,ue.start*Ne),ot=Math.min(ot,(ue.start+ue.count)*Ne)),Te!==null?(it=Math.max(it,0),ot=Math.min(ot,Te.count)):Fe!=null&&(it=Math.max(it,0),ot=Math.min(ot,Fe.count));const mt=ot-it;if(mt<0||mt===1/0)return;je.setup(V,Q,Ee,q,Te);let Wt,Je=ce;if(Te!==null&&(Wt=ee.get(Te),Je=Ue,Je.setIndex(Wt)),V.isMesh)Q.wireframe===!0?(Pe.setLineWidth(Q.wireframeLinewidth*Oe()),Je.setMode(L.LINES)):Je.setMode(L.TRIANGLES);else if(V.isLine){let Le=Q.linewidth;Le===void 0&&(Le=1),Pe.setLineWidth(Le*Oe()),V.isLineSegments?Je.setMode(L.LINES):V.isLineLoop?Je.setMode(L.LINE_LOOP):Je.setMode(L.LINE_STRIP)}else V.isPoints?Je.setMode(L.POINTS):V.isSprite&&Je.setMode(L.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)Je.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(Ce.get("WEBGL_multi_draw"))Je.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Le=V._multiDrawStarts,wt=V._multiDrawCounts,et=V._multiDrawCount,on=Te?ee.get(Te).bytesPerElement:1,pi=be.get(Q).currentProgram.getUniforms();for(let Xt=0;Xt<et;Xt++)pi.setValue(L,"_gl_DrawID",Xt),Je.render(Le[Xt]/on,wt[Xt])}else if(V.isInstancedMesh)Je.renderInstances(it,mt,V.count);else if(q.isInstancedBufferGeometry){const Le=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,wt=Math.min(q.instanceCount,Le);Je.renderInstances(it,mt,wt)}else Je.render(it,mt)};function $e(b,k,q){b.transparent===!0&&b.side===tn&&b.forceSinglePass===!1?(b.side=Gt,b.needsUpdate=!0,Ms(b,k,q),b.side=An,b.needsUpdate=!0,Ms(b,k,q),b.side=tn):Ms(b,k,q)}this.compile=function(b,k,q=null){q===null&&(q=b),f=Ye.get(q),f.init(k),x.push(f),q.traverseVisible(function(V){V.isLight&&V.layers.test(k.layers)&&(f.pushLight(V),V.castShadow&&f.pushShadow(V))}),b!==q&&b.traverseVisible(function(V){V.isLight&&V.layers.test(k.layers)&&(f.pushLight(V),V.castShadow&&f.pushShadow(V))}),f.setupLights();const Q=new Set;return b.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ue=V.material;if(ue)if(Array.isArray(ue))for(let ge=0;ge<ue.length;ge++){const Ee=ue[ge];$e(Ee,q,V),Q.add(Ee)}else $e(ue,q,V),Q.add(ue)}),x.pop(),f=null,Q},this.compileAsync=function(b,k,q=null){const Q=this.compile(b,k,q);return new Promise(V=>{function ue(){if(Q.forEach(function(ge){be.get(ge).currentProgram.isReady()&&Q.delete(ge)}),Q.size===0){V(b);return}setTimeout(ue,10)}Ce.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let zt=null;function vn(b){zt&&zt(b)}function Fo(){jn.stop()}function Lo(){jn.start()}const jn=new zc;jn.setAnimationLoop(vn),typeof self<"u"&&jn.setContext(self),this.setAnimationLoop=function(b){zt=b,K.setAnimationLoop(b),b===null?jn.stop():jn.start()},K.addEventListener("sessionstart",Fo),K.addEventListener("sessionend",Lo),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(k),k=K.getCamera()),b.isScene===!0&&b.onBeforeRender(v,b,k,_),f=Ye.get(b,x.length),f.init(k),x.push(f),ae.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),Re.setFromProjectionMatrix(ae),$=this.localClippingEnabled,X=oe.init(this.clippingPlanes,$),A=ve.get(b,m.length),A.init(),m.push(A),K.enabled===!0&&K.isPresenting===!0){const ue=v.xr.getDepthSensingMesh();ue!==null&&Er(ue,k,-1/0,v.sortObjects)}Er(b,k,0,v.sortObjects),A.finish(),v.sortObjects===!0&&A.sort(H,Y),He=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,He&&B.addToRenderList(A,b),this.info.render.frame++,X===!0&&oe.beginShadows();const q=f.state.shadowsArray;xe.render(q,b,k),X===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=A.opaque,V=A.transmissive;if(f.setupLights(),k.isArrayCamera){const ue=k.cameras;if(V.length>0)for(let ge=0,Ee=ue.length;ge<Ee;ge++){const Te=ue[ge];Uo(Q,V,b,Te)}He&&B.render(b);for(let ge=0,Ee=ue.length;ge<Ee;ge++){const Te=ue[ge];Bo(A,b,Te,Te.viewport)}}else V.length>0&&Uo(Q,V,b,k),He&&B.render(b),Bo(A,b,k);_!==null&&(R.updateMultisampleRenderTarget(_),R.updateRenderTargetMipmap(_)),b.isScene===!0&&b.onAfterRender(v,b,k),je.resetDefaultState(),w=-1,O=null,x.pop(),x.length>0?(f=x[x.length-1],X===!0&&oe.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,m.pop(),m.length>0?A=m[m.length-1]:A=null};function Er(b,k,q,Q){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLight)f.pushLight(b),b.castShadow&&f.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Re.intersectsSprite(b)){Q&&Ae.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ae);const ge=te.update(b),Ee=b.material;Ee.visible&&A.push(b,ge,Ee,q,Ae.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Re.intersectsObject(b))){const ge=te.update(b),Ee=b.material;if(Q&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ae.copy(b.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Ae.copy(ge.boundingSphere.center)),Ae.applyMatrix4(b.matrixWorld).applyMatrix4(ae)),Array.isArray(Ee)){const Te=ge.groups;for(let Ne=0,Ve=Te.length;Ne<Ve;Ne++){const Fe=Te[Ne],it=Ee[Fe.materialIndex];it&&it.visible&&A.push(b,ge,it,q,Ae.z,Fe)}}else Ee.visible&&A.push(b,ge,Ee,q,Ae.z,null)}}const ue=b.children;for(let ge=0,Ee=ue.length;ge<Ee;ge++)Er(ue[ge],k,q,Q)}function Bo(b,k,q,Q){const V=b.opaque,ue=b.transmissive,ge=b.transparent;f.setupLightsView(q),X===!0&&oe.setGlobalState(v.clippingPlanes,q),Q&&Pe.viewport(S.copy(Q)),V.length>0&&ys(V,k,q),ue.length>0&&ys(ue,k,q),ge.length>0&&ys(ge,k,q),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function Uo(b,k,q,Q){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[Q.id]===void 0&&(f.state.transmissionRenderTarget[Q.id]=new Yn(1,1,{generateMipmaps:!0,type:Ce.has("EXT_color_buffer_half_float")||Ce.has("EXT_color_buffer_float")?Zi:Sn,minFilter:ci,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const ue=f.state.transmissionRenderTarget[Q.id],ge=Q.viewport||S;ue.setSize(ge.z,ge.w);const Ee=v.getRenderTarget();v.setRenderTarget(ue),v.getClearColor(P),D=v.getClearAlpha(),D<1&&v.setClearColor(16777215,.5),v.clear(),He&&B.render(q);const Te=v.toneMapping;v.toneMapping=Qn;const Ne=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),f.setupLightsView(Q),X===!0&&oe.setGlobalState(v.clippingPlanes,Q),ys(b,q,Q),R.updateMultisampleRenderTarget(ue),R.updateRenderTargetMipmap(ue),Ce.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let Fe=0,it=k.length;Fe<it;Fe++){const ot=k[Fe],mt=ot.object,Wt=ot.geometry,Je=ot.material,Le=ot.group;if(Je.side===tn&&mt.layers.test(Q.layers)){const wt=Je.side;Je.side=Gt,Je.needsUpdate=!0,Oo(mt,q,Q,Wt,Je,Le),Je.side=wt,Je.needsUpdate=!0,Ve=!0}}Ve===!0&&(R.updateMultisampleRenderTarget(ue),R.updateRenderTargetMipmap(ue))}v.setRenderTarget(Ee),v.setClearColor(P,D),Ne!==void 0&&(Q.viewport=Ne),v.toneMapping=Te}function ys(b,k,q){const Q=k.isScene===!0?k.overrideMaterial:null;for(let V=0,ue=b.length;V<ue;V++){const ge=b[V],Ee=ge.object,Te=ge.geometry,Ne=Q===null?ge.material:Q,Ve=ge.group;Ee.layers.test(q.layers)&&Oo(Ee,k,q,Te,Ne,Ve)}}function Oo(b,k,q,Q,V,ue){b.onBeforeRender(v,k,q,Q,V,ue),b.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),V.onBeforeRender(v,k,q,Q,b,ue),V.transparent===!0&&V.side===tn&&V.forceSinglePass===!1?(V.side=Gt,V.needsUpdate=!0,v.renderBufferDirect(q,k,Q,V,b,ue),V.side=An,V.needsUpdate=!0,v.renderBufferDirect(q,k,Q,V,b,ue),V.side=tn):v.renderBufferDirect(q,k,Q,V,b,ue),b.onAfterRender(v,k,q,Q,V,ue)}function Ms(b,k,q){k.isScene!==!0&&(k=Ie);const Q=be.get(b),V=f.state.lights,ue=f.state.shadowsArray,ge=V.state.version,Ee=we.getParameters(b,V.state,ue,k,q),Te=we.getProgramCacheKey(Ee);let Ne=Q.programs;Q.environment=b.isMeshStandardMaterial?k.environment:null,Q.fog=k.fog,Q.envMap=(b.isMeshStandardMaterial?W:C).get(b.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&b.envMap===null?k.environmentRotation:b.envMapRotation,Ne===void 0&&(b.addEventListener("dispose",qe),Ne=new Map,Q.programs=Ne);let Ve=Ne.get(Te);if(Ve!==void 0){if(Q.currentProgram===Ve&&Q.lightsStateVersion===ge)return zo(b,Ee),Ve}else Ee.uniforms=we.getUniforms(b),b.onBeforeCompile(Ee,v),Ve=we.acquireProgram(Ee,Te),Ne.set(Te,Ve),Q.uniforms=Ee.uniforms;const Fe=Q.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Fe.clippingPlanes=oe.uniform),zo(b,Ee),Q.needsLights=nu(b),Q.lightsStateVersion=ge,Q.needsLights&&(Fe.ambientLightColor.value=V.state.ambient,Fe.lightProbe.value=V.state.probe,Fe.directionalLights.value=V.state.directional,Fe.directionalLightShadows.value=V.state.directionalShadow,Fe.spotLights.value=V.state.spot,Fe.spotLightShadows.value=V.state.spotShadow,Fe.rectAreaLights.value=V.state.rectArea,Fe.ltc_1.value=V.state.rectAreaLTC1,Fe.ltc_2.value=V.state.rectAreaLTC2,Fe.pointLights.value=V.state.point,Fe.pointLightShadows.value=V.state.pointShadow,Fe.hemisphereLights.value=V.state.hemi,Fe.directionalShadowMap.value=V.state.directionalShadowMap,Fe.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Fe.spotShadowMap.value=V.state.spotShadowMap,Fe.spotLightMatrix.value=V.state.spotLightMatrix,Fe.spotLightMap.value=V.state.spotLightMap,Fe.pointShadowMap.value=V.state.pointShadowMap,Fe.pointShadowMatrix.value=V.state.pointShadowMatrix),Q.currentProgram=Ve,Q.uniformsList=null,Ve}function No(b){if(b.uniformsList===null){const k=b.currentProgram.getUniforms();b.uniformsList=ar.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function zo(b,k){const q=be.get(b);q.outputColorSpace=k.outputColorSpace,q.batching=k.batching,q.batchingColor=k.batchingColor,q.instancing=k.instancing,q.instancingColor=k.instancingColor,q.instancingMorph=k.instancingMorph,q.skinning=k.skinning,q.morphTargets=k.morphTargets,q.morphNormals=k.morphNormals,q.morphColors=k.morphColors,q.morphTargetsCount=k.morphTargetsCount,q.numClippingPlanes=k.numClippingPlanes,q.numIntersection=k.numClipIntersection,q.vertexAlphas=k.vertexAlphas,q.vertexTangents=k.vertexTangents,q.toneMapping=k.toneMapping}function eu(b,k,q,Q,V){k.isScene!==!0&&(k=Ie),R.resetTextureUnits();const ue=k.fog,ge=Q.isMeshStandardMaterial?k.environment:null,Ee=_===null?v.outputColorSpace:_.isXRRenderTarget===!0?_.texture.colorSpace:Kn,Te=(Q.isMeshStandardMaterial?W:C).get(Q.envMap||ge),Ne=Q.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ve=!!q.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Fe=!!q.morphAttributes.position,it=!!q.morphAttributes.normal,ot=!!q.morphAttributes.color;let mt=Qn;Q.toneMapped&&(_===null||_.isXRRenderTarget===!0)&&(mt=v.toneMapping);const Wt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Je=Wt!==void 0?Wt.length:0,Le=be.get(Q),wt=f.state.lights;if(X===!0&&($===!0||b!==O)){const Zt=b===O&&Q.id===w;oe.setState(Q,b,Zt)}let et=!1;Q.version===Le.__version?(Le.needsLights&&Le.lightsStateVersion!==wt.state.version||Le.outputColorSpace!==Ee||V.isBatchedMesh&&Le.batching===!1||!V.isBatchedMesh&&Le.batching===!0||V.isBatchedMesh&&Le.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Le.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Le.instancing===!1||!V.isInstancedMesh&&Le.instancing===!0||V.isSkinnedMesh&&Le.skinning===!1||!V.isSkinnedMesh&&Le.skinning===!0||V.isInstancedMesh&&Le.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Le.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Le.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Le.instancingMorph===!1&&V.morphTexture!==null||Le.envMap!==Te||Q.fog===!0&&Le.fog!==ue||Le.numClippingPlanes!==void 0&&(Le.numClippingPlanes!==oe.numPlanes||Le.numIntersection!==oe.numIntersection)||Le.vertexAlphas!==Ne||Le.vertexTangents!==Ve||Le.morphTargets!==Fe||Le.morphNormals!==it||Le.morphColors!==ot||Le.toneMapping!==mt||Le.morphTargetsCount!==Je)&&(et=!0):(et=!0,Le.__version=Q.version);let on=Le.currentProgram;et===!0&&(on=Ms(Q,k,V));let pi=!1,Xt=!1,Tr=!1;const gt=on.getUniforms(),Fn=Le.uniforms;if(Pe.useProgram(on.program)&&(pi=!0,Xt=!0,Tr=!0),Q.id!==w&&(w=Q.id,Xt=!0),pi||O!==b){Ge.reverseDepthBuffer?(re.copy(b.projectionMatrix),hd(re),fd(re),gt.setValue(L,"projectionMatrix",re)):gt.setValue(L,"projectionMatrix",b.projectionMatrix),gt.setValue(L,"viewMatrix",b.matrixWorldInverse);const Zt=gt.map.cameraPosition;Zt!==void 0&&Zt.setValue(L,ye.setFromMatrixPosition(b.matrixWorld)),Ge.logarithmicDepthBuffer&&gt.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&gt.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),O!==b&&(O=b,Xt=!0,Tr=!0)}if(V.isSkinnedMesh){gt.setOptional(L,V,"bindMatrix"),gt.setOptional(L,V,"bindMatrixInverse");const Zt=V.skeleton;Zt&&(Zt.boneTexture===null&&Zt.computeBoneTexture(),gt.setValue(L,"boneTexture",Zt.boneTexture,R))}V.isBatchedMesh&&(gt.setOptional(L,V,"batchingTexture"),gt.setValue(L,"batchingTexture",V._matricesTexture,R),gt.setOptional(L,V,"batchingIdTexture"),gt.setValue(L,"batchingIdTexture",V._indirectTexture,R),gt.setOptional(L,V,"batchingColorTexture"),V._colorsTexture!==null&&gt.setValue(L,"batchingColorTexture",V._colorsTexture,R));const br=q.morphAttributes;if((br.position!==void 0||br.normal!==void 0||br.color!==void 0)&&ie.update(V,q,on),(Xt||Le.receiveShadow!==V.receiveShadow)&&(Le.receiveShadow=V.receiveShadow,gt.setValue(L,"receiveShadow",V.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Fn.envMap.value=Te,Fn.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&k.environment!==null&&(Fn.envMapIntensity.value=k.environmentIntensity),Xt&&(gt.setValue(L,"toneMappingExposure",v.toneMappingExposure),Le.needsLights&&tu(Fn,Tr),ue&&Q.fog===!0&&fe.refreshFogUniforms(Fn,ue),fe.refreshMaterialUniforms(Fn,Q,G,U,f.state.transmissionRenderTarget[b.id]),ar.upload(L,No(Le),Fn,R)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(ar.upload(L,No(Le),Fn,R),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&gt.setValue(L,"center",V.center),gt.setValue(L,"modelViewMatrix",V.modelViewMatrix),gt.setValue(L,"normalMatrix",V.normalMatrix),gt.setValue(L,"modelMatrix",V.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const Zt=Q.uniformsGroups;for(let wr=0,iu=Zt.length;wr<iu;wr++){const ko=Zt[wr];N.update(ko,on),N.bind(ko,on)}}return on}function tu(b,k){b.ambientLightColor.needsUpdate=k,b.lightProbe.needsUpdate=k,b.directionalLights.needsUpdate=k,b.directionalLightShadows.needsUpdate=k,b.pointLights.needsUpdate=k,b.pointLightShadows.needsUpdate=k,b.spotLights.needsUpdate=k,b.spotLightShadows.needsUpdate=k,b.rectAreaLights.needsUpdate=k,b.hemisphereLights.needsUpdate=k}function nu(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return _},this.setRenderTargetTextures=function(b,k,q){be.get(b.texture).__webglTexture=k,be.get(b.depthTexture).__webglTexture=q;const Q=be.get(b);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=q===void 0,Q.__autoAllocateDepthBuffer||Ce.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,k){const q=be.get(b);q.__webglFramebuffer=k,q.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,q=0){_=b,T=k,E=q;let Q=!0,V=null,ue=!1,ge=!1;if(b){const Te=be.get(b);if(Te.__useDefaultFramebuffer!==void 0)Pe.bindFramebuffer(L.FRAMEBUFFER,null),Q=!1;else if(Te.__webglFramebuffer===void 0)R.setupRenderTarget(b);else if(Te.__hasExternalTextures)R.rebindTextures(b,be.get(b.texture).__webglTexture,be.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Fe=b.depthTexture;if(Te.__boundDepthTexture!==Fe){if(Fe!==null&&be.has(Fe)&&(b.width!==Fe.image.width||b.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(b)}}const Ne=b.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ge=!0);const Ve=be.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ve[k])?V=Ve[k][q]:V=Ve[k],ue=!0):b.samples>0&&R.useMultisampledRTT(b)===!1?V=be.get(b).__webglMultisampledFramebuffer:Array.isArray(Ve)?V=Ve[q]:V=Ve,S.copy(b.viewport),M.copy(b.scissor),F=b.scissorTest}else S.copy(ne).multiplyScalar(G).floor(),M.copy(le).multiplyScalar(G).floor(),F=Be;if(Pe.bindFramebuffer(L.FRAMEBUFFER,V)&&Q&&Pe.drawBuffers(b,V),Pe.viewport(S),Pe.scissor(M),Pe.setScissorTest(F),ue){const Te=be.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+k,Te.__webglTexture,q)}else if(ge){const Te=be.get(b.texture),Ne=k||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Te.__webglTexture,q||0,Ne)}w=-1},this.readRenderTargetPixels=function(b,k,q,Q,V,ue,ge){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=be.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ge!==void 0&&(Ee=Ee[ge]),Ee){Pe.bindFramebuffer(L.FRAMEBUFFER,Ee);try{const Te=b.texture,Ne=Te.format,Ve=Te.type;if(!Ge.textureFormatReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ge.textureTypeReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=b.width-Q&&q>=0&&q<=b.height-V&&L.readPixels(k,q,Q,V,De.convert(Ne),De.convert(Ve),ue)}finally{const Te=_!==null?be.get(_).__webglFramebuffer:null;Pe.bindFramebuffer(L.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(b,k,q,Q,V,ue,ge){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=be.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ge!==void 0&&(Ee=Ee[ge]),Ee){const Te=b.texture,Ne=Te.format,Ve=Te.type;if(!Ge.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ge.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=b.width-Q&&q>=0&&q<=b.height-V){Pe.bindFramebuffer(L.FRAMEBUFFER,Ee);const Fe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Fe),L.bufferData(L.PIXEL_PACK_BUFFER,ue.byteLength,L.STREAM_READ),L.readPixels(k,q,Q,V,De.convert(Ne),De.convert(Ve),0);const it=_!==null?be.get(_).__webglFramebuffer:null;Pe.bindFramebuffer(L.FRAMEBUFFER,it);const ot=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await dd(L,ot,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Fe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ue),L.deleteBuffer(Fe),L.deleteSync(ot),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,k=null,q=0){b.isTexture!==!0&&(rr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,b=arguments[1]);const Q=Math.pow(2,-q),V=Math.floor(b.image.width*Q),ue=Math.floor(b.image.height*Q),ge=k!==null?k.x:0,Ee=k!==null?k.y:0;R.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,q,0,0,ge,Ee,V,ue),Pe.unbindTexture()},this.copyTextureToTexture=function(b,k,q=null,Q=null,V=0){b.isTexture!==!0&&(rr("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,b=arguments[1],k=arguments[2],V=arguments[3]||0,q=null);let ue,ge,Ee,Te,Ne,Ve;q!==null?(ue=q.max.x-q.min.x,ge=q.max.y-q.min.y,Ee=q.min.x,Te=q.min.y):(ue=b.image.width,ge=b.image.height,Ee=0,Te=0),Q!==null?(Ne=Q.x,Ve=Q.y):(Ne=0,Ve=0);const Fe=De.convert(k.format),it=De.convert(k.type);R.setTexture2D(k,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,k.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,k.unpackAlignment);const ot=L.getParameter(L.UNPACK_ROW_LENGTH),mt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Wt=L.getParameter(L.UNPACK_SKIP_PIXELS),Je=L.getParameter(L.UNPACK_SKIP_ROWS),Le=L.getParameter(L.UNPACK_SKIP_IMAGES),wt=b.isCompressedTexture?b.mipmaps[V]:b.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,wt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,wt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ee),L.pixelStorei(L.UNPACK_SKIP_ROWS,Te),b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,V,Ne,Ve,ue,ge,Fe,it,wt.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,V,Ne,Ve,wt.width,wt.height,Fe,wt.data):L.texSubImage2D(L.TEXTURE_2D,V,Ne,Ve,ue,ge,Fe,it,wt),L.pixelStorei(L.UNPACK_ROW_LENGTH,ot),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,mt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Wt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Je),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Le),V===0&&k.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),Pe.unbindTexture()},this.copyTextureToTexture3D=function(b,k,q=null,Q=null,V=0){b.isTexture!==!0&&(rr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,Q=arguments[1]||null,b=arguments[2],k=arguments[3],V=arguments[4]||0);let ue,ge,Ee,Te,Ne,Ve,Fe,it,ot;const mt=b.isCompressedTexture?b.mipmaps[V]:b.image;q!==null?(ue=q.max.x-q.min.x,ge=q.max.y-q.min.y,Ee=q.max.z-q.min.z,Te=q.min.x,Ne=q.min.y,Ve=q.min.z):(ue=mt.width,ge=mt.height,Ee=mt.depth,Te=0,Ne=0,Ve=0),Q!==null?(Fe=Q.x,it=Q.y,ot=Q.z):(Fe=0,it=0,ot=0);const Wt=De.convert(k.format),Je=De.convert(k.type);let Le;if(k.isData3DTexture)R.setTexture3D(k,0),Le=L.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)R.setTexture2DArray(k,0),Le=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,k.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,k.unpackAlignment);const wt=L.getParameter(L.UNPACK_ROW_LENGTH),et=L.getParameter(L.UNPACK_IMAGE_HEIGHT),on=L.getParameter(L.UNPACK_SKIP_PIXELS),pi=L.getParameter(L.UNPACK_SKIP_ROWS),Xt=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,mt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,mt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Te),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ne),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ve),b.isDataTexture||b.isData3DTexture?L.texSubImage3D(Le,V,Fe,it,ot,ue,ge,Ee,Wt,Je,mt.data):k.isCompressedArrayTexture?L.compressedTexSubImage3D(Le,V,Fe,it,ot,ue,ge,Ee,Wt,mt.data):L.texSubImage3D(Le,V,Fe,it,ot,ue,ge,Ee,Wt,Je,mt),L.pixelStorei(L.UNPACK_ROW_LENGTH,wt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,et),L.pixelStorei(L.UNPACK_SKIP_PIXELS,on),L.pixelStorei(L.UNPACK_SKIP_ROWS,pi),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Xt),V===0&&k.generateMipmaps&&L.generateMipmap(Le),Pe.unbindTexture()},this.initRenderTarget=function(b){be.get(b).__webglFramebuffer===void 0&&R.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?R.setTextureCube(b,0):b.isData3DTexture?R.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?R.setTexture2DArray(b,0):R.setTexture2D(b,0),Pe.unbindTexture()},this.resetState=function(){T=0,E=0,_=null,Pe.reset(),je.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===uo?"display-p3":"srgb",t.unpackColorSpace=nt.workingColorSpace===vr?"display-p3":"srgb"}}class bg extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class kn extends Nt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Vt,u=Vt,d,p){super(null,a,o,l,c,u,i,r,d,p),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class wg extends rn{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}class xs extends an{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],d=[],p=[],h=[];let g=0;const A=[],f=n/2;let m=0;x(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new Kt(d,3)),this.setAttribute("normal",new Kt(p,3)),this.setAttribute("uv",new Kt(h,2));function x(){const y=new I,T=new I;let E=0;const _=(t-e)/n;for(let w=0;w<=r;w++){const O=[],S=w/r,M=S*(t-e)+e;for(let F=0;F<=i;F++){const P=F/i,D=P*l+o,z=Math.sin(D),U=Math.cos(D);T.x=M*z,T.y=-S*n+f,T.z=M*U,d.push(T.x,T.y,T.z),y.set(z,_,U).normalize(),p.push(y.x,y.y,y.z),h.push(P,1-S),O.push(g++)}A.push(O)}for(let w=0;w<i;w++)for(let O=0;O<r;O++){const S=A[O][w],M=A[O+1][w],F=A[O+1][w+1],P=A[O][w+1];e>0&&(u.push(S,M,P),E+=3),t>0&&(u.push(M,F,P),E+=3)}c.addGroup(m,E,0),m+=E}function v(y){const T=g,E=new Me,_=new I;let w=0;const O=y===!0?e:t,S=y===!0?1:-1;for(let F=1;F<=i;F++)d.push(0,f*S,0),p.push(0,S,0),h.push(.5,.5),g++;const M=g;for(let F=0;F<=i;F++){const D=F/i*l+o,z=Math.cos(D),U=Math.sin(D);_.x=O*U,_.y=f*S,_.z=O*z,d.push(_.x,_.y,_.z),p.push(0,S,0),E.x=z*.5+.5,E.y=U*.5*S+.5,h.push(E.x,E.y),g++}for(let F=0;F<i;F++){const P=T+F,D=M+F;y===!0?u.push(D,D+1,P):u.push(D+1,D,P),w+=3}c.addGroup(m,w,y===!0?1:2),m+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xs(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ao extends xs{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Ao(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class hr extends an{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],d=new I,p=new I,h=[],g=[],A=[],f=[];for(let m=0;m<=n;m++){const x=[],v=m/n;let y=0;m===0&&a===0?y=.5/t:m===n&&l===Math.PI&&(y=-.5/t);for(let T=0;T<=t;T++){const E=T/t;d.x=-e*Math.cos(i+E*r)*Math.sin(a+v*o),d.y=e*Math.cos(a+v*o),d.z=e*Math.sin(i+E*r)*Math.sin(a+v*o),g.push(d.x,d.y,d.z),p.copy(d).normalize(),A.push(p.x,p.y,p.z),f.push(E+y,1-v),x.push(c++)}u.push(x)}for(let m=0;m<n;m++)for(let x=0;x<t;x++){const v=u[m][x+1],y=u[m][x],T=u[m+1][x],E=u[m+1][x+1];(m!==0||a>0)&&h.push(v,y,E),(m!==n-1||l<Math.PI)&&h.push(y,T,E)}this.setIndex(h),this.setAttribute("position",new Kt(g,3)),this.setAttribute("normal",new Kt(A,3)),this.setAttribute("uv",new Kt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Rg extends an{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class Ul{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Pt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ro}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ro);class Ig{constructor(e){Z(this,"camera");Z(this,"canvas");Z(this,"moveSpeed");Z(this,"lookSpeed");Z(this,"sprintMult");Z(this,"active",!1);Z(this,"keys",{});Z(this,"euler",new xn(0,0,0,"YXZ"));Z(this,"lastTime",0);Z(this,"onKeyDownBound");Z(this,"onKeyUpBound");Z(this,"onMouseMoveBound");Z(this,"onClickBound");Z(this,"onPointerLockChangeBound");this.camera=e.camera,this.canvas=e.canvas,this.moveSpeed=e.moveSpeed??2,this.lookSpeed=e.lookSpeed??.002,this.sprintMult=e.sprintMult??3,this.onKeyDownBound=this.onKeyDown.bind(this),this.onKeyUpBound=this.onKeyUp.bind(this),this.onMouseMoveBound=this.onMouseMove.bind(this),this.onClickBound=this.requestLock.bind(this),this.onPointerLockChangeBound=this.onPointerLockChange.bind(this)}enable(){this.euler.setFromQuaternion(this.camera.quaternion,"YXZ"),this.lastTime=performance.now(),this.active=!0,document.addEventListener("keydown",this.onKeyDownBound),document.addEventListener("keyup",this.onKeyUpBound),document.addEventListener("mousemove",this.onMouseMoveBound),document.addEventListener("pointerlockchange",this.onPointerLockChangeBound),this.canvas.addEventListener("click",this.onClickBound),this.requestLock()}disable(){this.active=!1,this.keys={},document.removeEventListener("keydown",this.onKeyDownBound),document.removeEventListener("keyup",this.onKeyUpBound),document.removeEventListener("mousemove",this.onMouseMoveBound),document.removeEventListener("pointerlockchange",this.onPointerLockChangeBound),this.canvas.removeEventListener("click",this.onClickBound),document.pointerLockElement===this.canvas&&document.exitPointerLock()}isActive(){return this.active}update(){if(!this.active)return;const e=performance.now(),t=Math.min((e-this.lastTime)/1e3,.1);this.lastTime=e;const n=this.keys.ShiftLeft||this.keys.ShiftRight,i=this.moveSpeed*(n?this.sprintMult:1)*t,r=new I(0,0,-1).applyQuaternion(this.camera.quaternion),a=new I(1,0,0).applyQuaternion(this.camera.quaternion),o=new I(0,1,0);(this.keys.KeyW||this.keys.ArrowUp)&&this.camera.position.addScaledVector(r,i),(this.keys.KeyS||this.keys.ArrowDown)&&this.camera.position.addScaledVector(r,-i),(this.keys.KeyA||this.keys.ArrowLeft)&&this.camera.position.addScaledVector(a,-i),(this.keys.KeyD||this.keys.ArrowRight)&&this.camera.position.addScaledVector(a,i),this.keys.KeyQ&&this.camera.position.addScaledVector(o,-i),this.keys.KeyE&&this.camera.position.addScaledVector(o,i)}requestLock(){document.pointerLockElement!==this.canvas&&this.canvas.requestPointerLock()}onPointerLockChange(){document.pointerLockElement!==this.canvas&&this.active}onKeyDown(e){this.active&&(this.keys[e.code]=!0,e.code==="Escape"&&(this.disable(),document.dispatchEvent(new CustomEvent("walkmode:exit"))),["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)&&e.preventDefault())}onKeyUp(e){this.keys[e.code]=!1}onMouseMove(e){!this.active||document.pointerLockElement!==this.canvas||(this.euler.y-=e.movementX*this.lookSpeed,this.euler.x-=e.movementY*this.lookSpeed,this.euler.x=Math.max(-Math.PI/2+.05,Math.min(Math.PI/2-.05,this.euler.x)),this.camera.quaternion.setFromEuler(this.euler))}}const Pg=[{name:"Truck",url:"https://huggingface.co/cakewalk/splat-data/resolve/main/nike.splat",sizeMB:8,description:"Small object scan for quick validation."},{name:"Garden",url:"https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/garden/point_cloud/iteration_30000/point_cloud.ply",sizeMB:180,description:"Outdoor scene with broad camera movement."},{name:"Room",url:"https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/room/point_cloud/iteration_30000/point_cloud.ply",sizeMB:120,description:"Indoor scene for navigation and framing checks."},{name:"Train",url:"https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/train/point_cloud/iteration_30000/point_cloud.ply",sizeMB:65,description:"Compact object scene with moderate load time."}];class Dg extends EventTarget{emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t}))}on(e,t){const n=i=>t(i.detail);return this.addEventListener(e,n),()=>this.removeEventListener(e,n)}}const oi=class oi{constructor(e,t){let n,i;this.promise=new Promise((c,u)=>{n=c,i=u});const r=n.bind(this),a=i.bind(this),o=(...c)=>{r(...c)},l=c=>{a(c)};e(o.bind(this),l.bind(this)),this.abortHandler=t,this.id=oi.idGen++}then(e){return new oi((t,n)=>{this.promise=this.promise.then((...i)=>{const r=e(...i);r instanceof Promise||r instanceof oi?r.then((...a)=>{t(...a)}):t(r)}).catch(i=>{n(i)})},this.abortHandler)}catch(e){return new oi(t=>{this.promise=this.promise.then((...n)=>{t(...n)}).catch(e)},this.abortHandler)}abort(e){this.abortHandler&&this.abortHandler(e)}};Z(oi,"idGen",0);let vs=oi;class Xc extends Error{constructor(e){super(e)}}(function(){const s=new Float32Array(1),e=new Int32Array(s.buffer);return function(t){s[0]=t;const n=e[0];let i=n>>16&32768,r=n>>12&2047;const a=n>>23&255;return a<103?i:a>142?(i|=31744,i|=(a==255?0:1)&&n&8388607,i):a<113?(r|=2048,i|=(r>>114-a)+(r>>113-a&1),i):(i|=a-112<<10|r>>1,i+=r&1,i)}})();const sa=function(){const s=new Float32Array(1),e=new Int32Array(s.buffer);return function(t){return s[0]=t,e[0]}}(),Fg=function(s,e){return s[e]+(s[e+1]<<8)+(s[e+2]<<16)+(s[e+3]<<24)},Cr=function(s,e,t=!0,n){const i=new AbortController,r=i.signal;let a=!1;const o=u=>{i.abort(u),a=!0};let l=!1;const c=(u,d,p,h)=>{e&&!l&&(e(u,d,p,h),u===100&&(l=!0))};return new vs((u,d)=>{const p={signal:r};n&&(p.headers=n),fetch(s,p).then(async h=>{if(!h.ok){const v=await h.text();d(new Error(`Fetch failed: ${h.status} ${h.statusText} ${v}`));return}const g=h.body.getReader();let A=0,f=h.headers.get("Content-Length"),m=f?parseInt(f):void 0;const x=[];for(;!a;)try{const{value:v,done:y}=await g.read();if(y){if(c(100,"100%",v,m),t){const _=new Blob(x).arrayBuffer();u(_)}else u();break}A+=v.length;let T,E;m!==void 0&&(T=A/m*100,E=`${T.toFixed(2)}%`),t&&x.push(v),c(T,E,v,m)}catch(v){d(v);return}}).catch(h=>{d(new Xc(h))})},o)},ht=function(s,e,t){return Math.max(Math.min(s,t),e)},Pi=function(){return performance.now()/1e3},Bi=s=>{if(s.geometry&&(s.geometry.dispose(),s.geometry=null),s.material&&(s.material.dispose(),s.material=null),s.children)for(let e of s.children)Bi(e)},Yt=(s,e)=>new Promise(t=>{window.setTimeout(()=>{t(s?s():void 0)},e?1:50)}),ki=(s=0)=>{let e=0;if(s===1)e=9;else if(s===2)e=24;else if(s===3)e=45;else if(s>3)throw new Error("getSphericalHarmonicsComponentCountForDegree() -> Invalid spherical harmonics degree");return e},So=()=>{let s,e;return{promise:new Promise((n,i)=>{s=n,e=i}),resolve:s,reject:e}},ra=s=>{let e,t;return s||(s=()=>{}),{promise:new vs((i,r)=>{e=i,t=r},s),resolve:e,reject:t}};class Lg{constructor(e,t,n){this.major=e,this.minor=t,this.patch=n}toString(){return`${this.major}_${this.minor}_${this.patch}`}}function xo(){const s=navigator.userAgent;return s.indexOf("iPhone")>0||s.indexOf("iPad")>0}function qc(){if(xo()){const s=navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);return new Lg(parseInt(s[1]||0,10),parseInt(s[2]||0,10),parseInt(s[3]||0,10))}else return null}const Bg=14,fs=class fs{constructor(e=0){this.sphericalHarmonicsDegree=e,this.sphericalHarmonicsCount=ki(this.sphericalHarmonicsDegree),this.componentCount=this.sphericalHarmonicsCount+Bg,this.defaultSphericalHarmonics=new Array(this.sphericalHarmonicsCount).fill(0),this.splats=[],this.splatCount=0}static createSplat(e=0){const t=[0,0,0,1,1,1,1,0,0,0,0,0,0,0];let n=ki(e);for(let i=0;i<n;i++)t.push(0);return t}addSplat(e){this.splats.push(e),this.splatCount++}getSplat(e){return this.splats[e]}addDefaultSplat(){const e=fs.createSplat(this.sphericalHarmonicsDegree);return this.addSplat(e),e}addSplatFromComonents(e,t,n,i,r,a,o,l,c,u,d,p,h,g,...A){const f=[e,t,n,i,r,a,o,l,c,u,d,p,h,g,...this.defaultSphericalHarmonics];for(let m=0;m<A.length&&m<this.sphericalHarmonicsCount;m++)f[m]=A[m];return this.addSplat(f),f}addSplatFromArray(e,t){const n=e.splats[t],i=fs.createSplat(this.sphericalHarmonicsDegree);for(let r=0;r<this.componentCount&&r<n.length;r++)i[r]=n[r];this.addSplat(i)}};Z(fs,"OFFSET",{X:0,Y:1,Z:2,SCALE0:3,SCALE1:4,SCALE2:5,ROTATION0:6,ROTATION1:7,ROTATION2:8,ROTATION3:9,FDC0:10,FDC1:11,FDC2:12,OPACITY:13,FRC0:14,FRC1:15,FRC2:16,FRC3:17,FRC4:18,FRC5:19,FRC6:20,FRC7:21,FRC8:22,FRC9:23,FRC10:24,FRC11:25,FRC12:26,FRC13:27,FRC14:28,FRC15:29,FRC16:30,FRC17:31,FRC18:32,FRC19:33,FRC20:34,FRC21:35,FRC22:36,FRC23:37});let de=fs;class Qe{}Z(Qe,"DefaultSplatSortDistanceMapPrecision",16),Z(Qe,"MemoryPageSize",65536),Z(Qe,"BytesPerFloat",4),Z(Qe,"BytesPerInt",4),Z(Qe,"MaxScenes",32),Z(Qe,"ProgressiveLoadSectionSize",262144),Z(Qe,"ProgressiveLoadSectionDelayDuration",15),Z(Qe,"SphericalHarmonics8BitCompressionRange",3);const Ug=Qe.SphericalHarmonics8BitCompressionRange,Hn=Ug/2,Mt=Ss.toHalfFloat.bind(Ss),vo=Ss.fromHalfFloat.bind(Ss),dt=(s,e,t=!1,n,i)=>{if(e===0)return s;if(e===1||e===2&&!t)return Ss.fromHalfFloat(s);if(e===2)return _o(s,n,i)},cs=(s,e,t)=>{s=ht(s,e,t);const n=t-e;return ht(Math.floor((s-e)/n*255),0,255)},_o=(s,e,t)=>{const n=t-e;return s/255*n+e},Qc=(s,e,t)=>cs(vo(s,e,t)),Og=(s,e,t)=>Mt(_o(s,e,t)),tt=(s,e,t,n=!1)=>t===0?s.getFloat32(e*4,!0):t===1||t===2&&!n?s.getUint16(e*2,!0):s.getUint8(e,!0),Ng=function(){const s=e=>e;return function(e,t,n,i=!1){if(t===n)return e;let r=s;return t===2&&i?n===1?r=Og:n==0&&(r=_o):t===2||t===1?n===0?r=vo:n==2&&(i?r=Qc:r=s):t===0&&(n===1?r=Mt:n==2&&(i?r=cs:r=Mt)),r(e)}}(),Di=(s,e,t,n,i=0)=>{const r=new Uint8Array(s,e),a=new Uint8Array(t,n);for(let o=0;o<i;o++)a[o]=r[o]},j=class j{constructor(e,t=!0){Z(this,"getSplatScaleAndRotation",function(){const e=new ke,t=new ke,n=new ke,i=new I,r=new I,a=new ut;return function(o,l,c,u,d){const p=this.globalSplatIndexToSectionMap[o],h=this.sections[p],g=o-h.splatCountOffset,A=h.bytesPerSplat*g+j.CompressionLevels[this.compressionLevel].ScaleOffsetBytes,f=new DataView(this.bufferData,h.dataBase+A);r.set(dt(tt(f,0,this.compressionLevel),this.compressionLevel),dt(tt(f,1,this.compressionLevel),this.compressionLevel),dt(tt(f,2,this.compressionLevel),this.compressionLevel)),d&&(d.x!==void 0&&(r.x=d.x),d.y!==void 0&&(r.y=d.y),d.z!==void 0&&(r.z=d.z)),a.set(dt(tt(f,4,this.compressionLevel),this.compressionLevel),dt(tt(f,5,this.compressionLevel),this.compressionLevel),dt(tt(f,6,this.compressionLevel),this.compressionLevel),dt(tt(f,3,this.compressionLevel),this.compressionLevel)),u?(e.makeScale(r.x,r.y,r.z),t.makeRotationFromQuaternion(a),n.copy(e).multiply(t).multiply(u),n.decompose(i,c,l)):(l.copy(r),c.copy(a))}}());Z(this,"fillSplatScaleRotationArray",function(){const e=new ke,t=new ke,n=new ke,i=new I,r=new ut,a=new I,o=l=>{const c=l.w<0?-1:1;l.x*=c,l.y*=c,l.z*=c,l.w*=c};return function(l,c,u,d,p,h,g,A){const f=this.splatCount;d=d||0,p=p||f-1,h===void 0&&(h=d);const m=(x,v)=>Ng(x,v,g);for(let x=d;x<=p;x++){const v=this.globalSplatIndexToSectionMap[x],y=this.sections[v],T=x-y.splatCountOffset,E=y.bytesPerSplat*T+j.CompressionLevels[this.compressionLevel].ScaleOffsetBytes,_=(x-d+h)*j.ScaleComponentCount,w=(x-d+h)*j.RotationComponentCount,O=new DataView(this.bufferData,y.dataBase+E),S=A&&A.x!==void 0?A.x:tt(O,0,this.compressionLevel),M=A&&A.y!==void 0?A.y:tt(O,1,this.compressionLevel),F=A&&A.z!==void 0?A.z:tt(O,2,this.compressionLevel),P=tt(O,3,this.compressionLevel),D=tt(O,4,this.compressionLevel),z=tt(O,5,this.compressionLevel),U=tt(O,6,this.compressionLevel);i.set(dt(S,this.compressionLevel),dt(M,this.compressionLevel),dt(F,this.compressionLevel)),r.set(dt(D,this.compressionLevel),dt(z,this.compressionLevel),dt(U,this.compressionLevel),dt(P,this.compressionLevel)).normalize(),u&&(a.set(0,0,0),e.makeScale(i.x,i.y,i.z),t.makeRotationFromQuaternion(r),n.identity().premultiply(e).premultiply(t),n.premultiply(u),n.decompose(a,r,i),r.normalize()),o(r),l&&(l[_]=m(i.x,0),l[_+1]=m(i.y,0),l[_+2]=m(i.z,0)),c&&(c[w]=m(r.x,0),c[w+1]=m(r.y,0),c[w+2]=m(r.z,0),c[w+3]=m(r.w,0))}}}());Z(this,"fillSphericalHarmonicsArray",function(){for(let D=0;D<15;D++)new I;const e=new ze,t=new ke,n=new I,i=new I,r=new ut,a=[],o=[],l=[],c=[],u=[],d=[],p=[],h=[],g=[],A=[],f=[],m=[],x=[],v=[],y=[],T=[],E=[],_=[],w=D=>D,O=(D,z,U,G)=>{D[0]=z,D[1]=U,D[2]=G},S=(D,z,U,G,H)=>{D[0]=tt(z,G,H,!0),D[1]=tt(z,G+U,H,!0),D[2]=tt(z,G+U+U,H,!0)},M=(D,z)=>{z[0]=D[0],z[1]=D[1],z[2]=D[2]},F=(D,z,U,G)=>{z[U]=G(D[0]),z[U+1]=G(D[1]),z[U+2]=G(D[2])},P=(D,z,U,G,H)=>(z[0]=dt(D[0],U,!0,G,H),z[1]=dt(D[1],U,!0,G,H),z[2]=dt(D[2],U,!0,G,H),z);return function(D,z,U,G,H,Y,ne){const le=this.splatCount;G=G||0,H=H||le-1,Y===void 0&&(Y=G),U&&z>=1&&(t.copy(U),t.decompose(n,r,i),r.normalize(),t.makeRotationFromQuaternion(r),e.setFromMatrix4(t),O(a,e.elements[4],-e.elements[7],e.elements[1]),O(o,-e.elements[5],e.elements[8],-e.elements[2]),O(l,e.elements[3],-e.elements[6],e.elements[0]));const Be=X=>Qc(X,this.minSphericalHarmonicsCoeff,this.maxSphericalHarmonicsCoeff),Re=X=>cs(X,this.minSphericalHarmonicsCoeff,this.maxSphericalHarmonicsCoeff);for(let X=G;X<=H;X++){const $=this.globalSplatIndexToSectionMap[X],re=this.sections[$];z=Math.min(z,re.sphericalHarmonicsDegree);const ae=ki(z),ye=X-re.splatCountOffset,Ae=re.bytesPerSplat*ye+j.CompressionLevels[this.compressionLevel].SphericalHarmonicsOffsetBytes,Ie=new DataView(this.bufferData,re.dataBase+Ae),He=(X-G+Y)*ae;let Oe=U?0:this.compressionLevel,L=w;Oe!==ne&&(Oe===1?ne===0?L=vo:ne==2&&(L=Be):Oe===0&&(ne===1?L=Mt:ne==2&&(L=Re)));const Ke=this.minSphericalHarmonicsCoeff,Ce=this.maxSphericalHarmonicsCoeff;z>=1&&(S(g,Ie,3,0,this.compressionLevel),S(A,Ie,3,1,this.compressionLevel),S(f,Ie,3,2,this.compressionLevel),U?(P(g,g,this.compressionLevel,Ke,Ce),P(A,A,this.compressionLevel,Ke,Ce),P(f,f,this.compressionLevel,Ke,Ce),j.rotateSphericalHarmonics3(g,A,f,a,o,l,v,y,T)):(M(g,v),M(A,y),M(f,T)),F(v,D,He,L),F(y,D,He+3,L),F(T,D,He+6,L),z>=2&&(S(g,Ie,5,9,this.compressionLevel),S(A,Ie,5,10,this.compressionLevel),S(f,Ie,5,11,this.compressionLevel),S(m,Ie,5,12,this.compressionLevel),S(x,Ie,5,13,this.compressionLevel),U?(P(g,g,this.compressionLevel,Ke,Ce),P(A,A,this.compressionLevel,Ke,Ce),P(f,f,this.compressionLevel,Ke,Ce),P(m,m,this.compressionLevel,Ke,Ce),P(x,x,this.compressionLevel,Ke,Ce),j.rotateSphericalHarmonics5(g,A,f,m,x,a,o,l,c,u,d,p,h,v,y,T,E,_)):(M(g,v),M(A,y),M(f,T),M(m,E),M(x,_)),F(v,D,He+9,L),F(y,D,He+12,L),F(T,D,He+15,L),F(E,D,He+18,L),F(_,D,He+21,L)))}}}());this.constructFromBuffer(e,t)}getSplatCount(){return this.splatCount}getMaxSplatCount(){return this.maxSplatCount}getMinSphericalHarmonicsDegree(){let e=0;for(let t=0;t<this.sections.length;t++){const n=this.sections[t];(t===0||n.sphericalHarmonicsDegree<e)&&(e=n.sphericalHarmonicsDegree)}return e}getBucketIndex(e,t){let n;const i=e.fullBucketCount*e.bucketSize;if(t<i)n=Math.floor(t/e.bucketSize);else{let r=i;n=e.fullBucketCount;let a=0;for(;r<e.splatCount;){let o=e.partiallyFilledBucketLengths[a];if(t>=r&&t<r+o)break;r+=o,n++,a++}}return n}getSplatCenter(e,t,n){const i=this.globalSplatIndexToSectionMap[e],r=this.sections[i],a=e-r.splatCountOffset,o=r.bytesPerSplat*a,l=new DataView(this.bufferData,r.dataBase+o),c=tt(l,0,this.compressionLevel),u=tt(l,1,this.compressionLevel),d=tt(l,2,this.compressionLevel);if(this.compressionLevel>=1){const h=this.getBucketIndex(r,a)*j.BucketStorageSizeFloats,g=r.compressionScaleFactor,A=r.compressionScaleRange;t.x=(c-A)*g+r.bucketArray[h],t.y=(u-A)*g+r.bucketArray[h+1],t.z=(d-A)*g+r.bucketArray[h+2]}else t.x=c,t.y=u,t.z=d;n&&t.applyMatrix4(n)}getSplatColor(e,t){const n=this.globalSplatIndexToSectionMap[e],i=this.sections[n],r=e-i.splatCountOffset,a=i.bytesPerSplat*r+j.CompressionLevels[this.compressionLevel].ColorOffsetBytes,o=new Uint8Array(this.bufferData,i.dataBase+a,4);t.set(o[0],o[1],o[2],o[3])}fillSplatCenterArray(e,t,n,i,r){const a=this.splatCount;n=n||0,i=i||a-1,r===void 0&&(r=n);const o=new I;for(let l=n;l<=i;l++){const c=this.globalSplatIndexToSectionMap[l],u=this.sections[c],d=l-u.splatCountOffset,p=(l-n+r)*j.CenterComponentCount,h=u.bytesPerSplat*d,g=new DataView(this.bufferData,u.dataBase+h),A=tt(g,0,this.compressionLevel),f=tt(g,1,this.compressionLevel),m=tt(g,2,this.compressionLevel);if(this.compressionLevel>=1){const v=this.getBucketIndex(u,d)*j.BucketStorageSizeFloats,y=u.compressionScaleFactor,T=u.compressionScaleRange;o.x=(A-T)*y+u.bucketArray[v],o.y=(f-T)*y+u.bucketArray[v+1],o.z=(m-T)*y+u.bucketArray[v+2]}else o.x=A,o.y=f,o.z=m;t&&o.applyMatrix4(t),e[p]=o.x,e[p+1]=o.y,e[p+2]=o.z}}fillSplatCovarianceArray(e,t,n,i,r,a){const o=this.splatCount,l=new I,c=new ut;n=n||0,i=i||o-1,r===void 0&&(r=n);for(let u=n;u<=i;u++){const d=this.globalSplatIndexToSectionMap[u],p=this.sections[d],h=u-p.splatCountOffset,g=(u-n+r)*j.CovarianceComponentCount,A=p.bytesPerSplat*h+j.CompressionLevels[this.compressionLevel].ScaleOffsetBytes,f=new DataView(this.bufferData,p.dataBase+A);l.set(dt(tt(f,0,this.compressionLevel),this.compressionLevel),dt(tt(f,1,this.compressionLevel),this.compressionLevel),dt(tt(f,2,this.compressionLevel),this.compressionLevel)),c.set(dt(tt(f,4,this.compressionLevel),this.compressionLevel),dt(tt(f,5,this.compressionLevel),this.compressionLevel),dt(tt(f,6,this.compressionLevel),this.compressionLevel),dt(tt(f,3,this.compressionLevel),this.compressionLevel)),j.computeCovariance(l,c,t,e,g,a)}}fillSplatColorArray(e,t,n,i,r){const a=this.splatCount;n=n||0,i=i||a-1,r===void 0&&(r=n);for(let o=n;o<=i;o++){const l=this.globalSplatIndexToSectionMap[o],c=this.sections[l],u=o-c.splatCountOffset,d=(o-n+r)*j.ColorComponentCount,p=c.bytesPerSplat*u+j.CompressionLevels[this.compressionLevel].ColorOffsetBytes,h=new Uint8Array(this.bufferData,c.dataBase+p);let g=h[3];g=g>=t?g:0,e[d]=h[0],e[d+1]=h[1],e[d+2]=h[2],e[d+3]=g}}static parseHeader(e){const t=new Uint8Array(e,0,j.HeaderSizeBytes),n=new Uint16Array(e,0,j.HeaderSizeBytes/2),i=new Uint32Array(e,0,j.HeaderSizeBytes/4),r=new Float32Array(e,0,j.HeaderSizeBytes/4),a=t[0],o=t[1],l=i[1],c=i[2],u=i[3],d=i[4],p=n[10],h=new I(r[6],r[7],r[8]),g=r[9]||-Hn,A=r[10]||Hn;return{versionMajor:a,versionMinor:o,maxSectionCount:l,sectionCount:c,maxSplatCount:u,splatCount:d,compressionLevel:p,sceneCenter:h,minSphericalHarmonicsCoeff:g,maxSphericalHarmonicsCoeff:A}}static writeHeaderCountsToBuffer(e,t,n){const i=new Uint32Array(n,0,j.HeaderSizeBytes/4);i[2]=e,i[4]=t}static writeHeaderToBuffer(e,t){const n=new Uint8Array(t,0,j.HeaderSizeBytes),i=new Uint16Array(t,0,j.HeaderSizeBytes/2),r=new Uint32Array(t,0,j.HeaderSizeBytes/4),a=new Float32Array(t,0,j.HeaderSizeBytes/4);n[0]=e.versionMajor,n[1]=e.versionMinor,n[2]=0,n[3]=0,r[1]=e.maxSectionCount,r[2]=e.sectionCount,r[3]=e.maxSplatCount,r[4]=e.splatCount,i[10]=e.compressionLevel,a[6]=e.sceneCenter.x,a[7]=e.sceneCenter.y,a[8]=e.sceneCenter.z,a[9]=e.minSphericalHarmonicsCoeff||-Hn,a[10]=e.maxSphericalHarmonicsCoeff||Hn}static parseSectionHeaders(e,t,n=0,i){const r=e.compressionLevel,a=e.maxSectionCount,o=new Uint16Array(t,n,a*j.SectionHeaderSizeBytes/2),l=new Uint32Array(t,n,a*j.SectionHeaderSizeBytes/4),c=new Float32Array(t,n,a*j.SectionHeaderSizeBytes/4),u=[];let d=0,p=d/2,h=d/4,g=j.HeaderSizeBytes+e.maxSectionCount*j.SectionHeaderSizeBytes,A=0;for(let f=0;f<a;f++){const m=l[h+1],x=l[h+2],v=l[h+3],y=c[h+4],T=y/2,E=o[p+10],_=l[h+6]||j.CompressionLevels[r].ScaleRange,w=l[h+8],O=l[h+9],S=O*4,M=E*v+S,F=o[p+20],{bytesPerSplat:P}=j.calculateComponentStorage(r,F),D=P*m,z=D+M,U={bytesPerSplat:P,splatCountOffset:A,splatCount:i?m:0,maxSplatCount:m,bucketSize:x,bucketCount:v,bucketBlockSize:y,halfBucketBlockSize:T,bucketStorageSizeBytes:E,bucketsStorageSizeBytes:M,splatDataStorageSizeBytes:D,storageSizeBytes:z,compressionScaleRange:_,compressionScaleFactor:T/_,base:g,bucketsBase:g+S,dataBase:g+M,fullBucketCount:w,partiallyFilledBucketCount:O,sphericalHarmonicsDegree:F};u[f]=U,g+=z,d+=j.SectionHeaderSizeBytes,p=d/2,h=d/4,A+=m}return u}static writeSectionHeaderToBuffer(e,t,n,i=0){const r=new Uint16Array(n,i,j.SectionHeaderSizeBytes/2),a=new Uint32Array(n,i,j.SectionHeaderSizeBytes/4),o=new Float32Array(n,i,j.SectionHeaderSizeBytes/4);a[0]=e.splatCount,a[1]=e.maxSplatCount,a[2]=t>=1?e.bucketSize:0,a[3]=t>=1?e.bucketCount:0,o[4]=t>=1?e.bucketBlockSize:0,r[10]=t>=1?j.BucketStorageSizeBytes:0,a[6]=t>=1?e.compressionScaleRange:0,a[7]=e.storageSizeBytes,a[8]=t>=1?e.fullBucketCount:0,a[9]=t>=1?e.partiallyFilledBucketCount:0,r[20]=e.sphericalHarmonicsDegree}static writeSectionHeaderSplatCountToBuffer(e,t,n=0){const i=new Uint32Array(t,n,j.SectionHeaderSizeBytes/4);i[0]=e}constructFromBuffer(e,t){this.bufferData=e,this.globalSplatIndexToLocalSplatIndexMap=[],this.globalSplatIndexToSectionMap=[];const n=j.parseHeader(this.bufferData);this.versionMajor=n.versionMajor,this.versionMinor=n.versionMinor,this.maxSectionCount=n.maxSectionCount,this.sectionCount=t?n.maxSectionCount:0,this.maxSplatCount=n.maxSplatCount,this.splatCount=t?n.maxSplatCount:0,this.compressionLevel=n.compressionLevel,this.sceneCenter=new I().copy(n.sceneCenter),this.minSphericalHarmonicsCoeff=n.minSphericalHarmonicsCoeff,this.maxSphericalHarmonicsCoeff=n.maxSphericalHarmonicsCoeff,this.sections=j.parseSectionHeaders(n,this.bufferData,j.HeaderSizeBytes,t),this.linkBufferArrays(),this.buildMaps()}static calculateComponentStorage(e,t){const n=j.CompressionLevels[e].BytesPerCenter,i=j.CompressionLevels[e].BytesPerScale,r=j.CompressionLevels[e].BytesPerRotation,a=j.CompressionLevels[e].BytesPerColor,o=ki(t),l=j.CompressionLevels[e].BytesPerSphericalHarmonicsComponent*o,c=n+i+r+a+l;return{bytesPerCenter:n,bytesPerScale:i,bytesPerRotation:r,bytesPerColor:a,sphericalHarmonicsComponentsPerSplat:o,sphericalHarmonicsBytesPerSplat:l,bytesPerSplat:c}}linkBufferArrays(){for(let e=0;e<this.maxSectionCount;e++){const t=this.sections[e];t.bucketArray=new Float32Array(this.bufferData,t.bucketsBase,t.bucketCount*j.BucketStorageSizeFloats),t.partiallyFilledBucketCount>0&&(t.partiallyFilledBucketLengths=new Uint32Array(this.bufferData,t.base,t.partiallyFilledBucketCount))}}buildMaps(){let e=0;for(let t=0;t<this.maxSectionCount;t++){const n=this.sections[t];for(let i=0;i<n.maxSplatCount;i++){const r=e+i;this.globalSplatIndexToLocalSplatIndexMap[r]=i,this.globalSplatIndexToSectionMap[r]=t}e+=n.maxSplatCount}}updateLoadedCounts(e,t){j.writeHeaderCountsToBuffer(e,t,this.bufferData),this.sectionCount=e,this.splatCount=t}updateSectionLoadedCounts(e,t){const n=j.HeaderSizeBytes+j.SectionHeaderSizeBytes*e;j.writeSectionHeaderSplatCountToBuffer(t,this.bufferData,n),this.sections[e].splatCount=t}static generateFromUncompressedSplatArrays(e,t,n,i,r,a,o=[]){let l=0;for(let T=0;T<e.length;T++){const E=e[T];l=Math.max(E.sphericalHarmonicsDegree,l)}let c,u;for(let T=0;T<e.length;T++){const E=e[T];for(let _=0;_<E.splats.length;_++){const w=E.splats[_];for(let O=de.OFFSET.FRC0;O<de.OFFSET.FRC23&&O<w.length;O++)(!c||w[O]<c)&&(c=w[O]),(!u||w[O]>u)&&(u=w[O])}}c=c||-Hn,u=u||Hn;const{bytesPerSplat:d}=j.calculateComponentStorage(n,l),p=j.CompressionLevels[n].ScaleRange,h=[],g=[];let A=0;for(let T=0;T<e.length;T++){const E=e[T],_=new de(l);for(let $=0;$<E.splatCount;$++){const re=E.splats[$];(re[de.OFFSET.OPACITY]||0)>=t&&_.addSplat(re)}const w=o[T]||{},O=(w.blockSizeFactor||1)*(r||j.BucketBlockSize),S=Math.ceil((w.bucketSizeFactor||1)*(a||j.BucketSize)),M=j.computeBucketsForUncompressedSplatArray(_,O,S),F=M.fullBuckets.length,P=M.partiallyFullBuckets.map($=>$.splats.length),D=P.length,z=[...M.fullBuckets,...M.partiallyFullBuckets],U=_.splats.length*d,G=D*4,H=n>=1?z.length*j.BucketStorageSizeBytes+G:0,Y=U+H,ne=new ArrayBuffer(Y),le=p/(O*.5),Be=new I;let Re=0;for(let $=0;$<z.length;$++){const re=z[$];Be.fromArray(re.center);for(let ae=0;ae<re.splats.length;ae++){let ye=re.splats[ae];const Ae=_.splats[ye],Ie=H+Re*d;j.writeSplatDataToSectionBuffer(Ae,ne,Ie,n,l,Be,le,p,c,u),Re++}}if(A+=Re,n>=1){const $=new Uint32Array(ne,0,P.length*4);for(let ae=0;ae<P.length;ae++)$[ae]=P[ae];const re=new Float32Array(ne,G,z.length*j.BucketStorageSizeFloats);for(let ae=0;ae<z.length;ae++){const ye=z[ae],Ae=ae*3;re[Ae]=ye.center[0],re[Ae+1]=ye.center[1],re[Ae+2]=ye.center[2]}}h.push(ne);const X=new ArrayBuffer(j.SectionHeaderSizeBytes);j.writeSectionHeaderToBuffer({maxSplatCount:Re,splatCount:Re,bucketSize:S,bucketCount:z.length,bucketBlockSize:O,compressionScaleRange:p,storageSizeBytes:Y,fullBucketCount:F,partiallyFilledBucketCount:D,sphericalHarmonicsDegree:l},n,X,0),g.push(X)}let f=0;for(let T of h)f+=T.byteLength;const m=j.HeaderSizeBytes+j.SectionHeaderSizeBytes*h.length+f,x=new ArrayBuffer(m);j.writeHeaderToBuffer({versionMajor:0,versionMinor:1,maxSectionCount:h.length,sectionCount:h.length,maxSplatCount:A,splatCount:A,compressionLevel:n,sceneCenter:i,minSphericalHarmonicsCoeff:c,maxSphericalHarmonicsCoeff:u},x);let v=j.HeaderSizeBytes;for(let T of g)new Uint8Array(x,v,j.SectionHeaderSizeBytes).set(new Uint8Array(T)),v+=j.SectionHeaderSizeBytes;for(let T of h)new Uint8Array(x,v,T.byteLength).set(new Uint8Array(T)),v+=T.byteLength;return new j(x)}static computeBucketsForUncompressedSplatArray(e,t,n){let i=e.splatCount;const r=t/2,a=new I,o=new I;for(let A=0;A<i;A++){const f=e.splats[A],m=[f[de.OFFSET.X],f[de.OFFSET.Y],f[de.OFFSET.Z]];(A===0||m[0]<a.x)&&(a.x=m[0]),(A===0||m[0]>o.x)&&(o.x=m[0]),(A===0||m[1]<a.y)&&(a.y=m[1]),(A===0||m[1]>o.y)&&(o.y=m[1]),(A===0||m[2]<a.z)&&(a.z=m[2]),(A===0||m[2]>o.z)&&(o.z=m[2])}const l=new I().copy(o).sub(a),c=Math.ceil(l.y/t),u=Math.ceil(l.z/t),d=new I,p=[],h={};for(let A=0;A<i;A++){const f=e.splats[A],m=[f[de.OFFSET.X],f[de.OFFSET.Y],f[de.OFFSET.Z]],x=Math.floor((m[0]-a.x)/t),v=Math.floor((m[1]-a.y)/t),y=Math.floor((m[2]-a.z)/t);d.x=x*t+a.x+r,d.y=v*t+a.y+r,d.z=y*t+a.z+r;const T=x*(c*u)+v*u+y;let E=h[T];E||(h[T]=E={splats:[],center:d.toArray()}),E.splats.push(A),E.splats.length>=n&&(p.push(E),h[T]=null)}const g=[];for(let A in h)if(h.hasOwnProperty(A)){const f=h[A];f&&g.push(f)}return{fullBuckets:p,partiallyFullBuckets:g}}static preallocateUncompressed(e,t){const n=j.CompressionLevels[0].SphericalHarmonicsDegrees[t],i=j.HeaderSizeBytes+j.SectionHeaderSizeBytes,r=i+n.BytesPerSplat*e,a=new ArrayBuffer(r);return j.writeHeaderToBuffer({versionMajor:j.CurrentMajorVersion,versionMinor:j.CurrentMinorVersion,maxSectionCount:1,sectionCount:1,maxSplatCount:e,splatCount:e,compressionLevel:0,sceneCenter:new I},a),j.writeSectionHeaderToBuffer({maxSplatCount:e,splatCount:e,bucketSize:0,bucketCount:0,bucketBlockSize:0,compressionScaleRange:0,storageSizeBytes:0,fullBucketCount:0,partiallyFilledBucketCount:0,sphericalHarmonicsDegree:t},0,a,j.HeaderSizeBytes),{splatBuffer:new j(a,!0),splatBufferDataOffsetBytes:i}}};Z(j,"CurrentMajorVersion",0),Z(j,"CurrentMinorVersion",1),Z(j,"CenterComponentCount",3),Z(j,"ScaleComponentCount",3),Z(j,"RotationComponentCount",4),Z(j,"ColorComponentCount",4),Z(j,"CovarianceComponentCount",6),Z(j,"SplatScaleOffsetFloat",3),Z(j,"SplatRotationOffsetFloat",6),Z(j,"CompressionLevels",{0:{BytesPerCenter:12,BytesPerScale:12,BytesPerRotation:16,BytesPerColor:4,ScaleOffsetBytes:12,RotationffsetBytes:24,ColorOffsetBytes:40,SphericalHarmonicsOffsetBytes:44,ScaleRange:1,BytesPerSphericalHarmonicsComponent:4,SphericalHarmonicsOffsetFloat:11,SphericalHarmonicsDegrees:{0:{BytesPerSplat:44},1:{BytesPerSplat:80},2:{BytesPerSplat:140}}},1:{BytesPerCenter:6,BytesPerScale:6,BytesPerRotation:8,BytesPerColor:4,ScaleOffsetBytes:6,RotationffsetBytes:12,ColorOffsetBytes:20,SphericalHarmonicsOffsetBytes:24,ScaleRange:32767,BytesPerSphericalHarmonicsComponent:2,SphericalHarmonicsOffsetFloat:12,SphericalHarmonicsDegrees:{0:{BytesPerSplat:24},1:{BytesPerSplat:42},2:{BytesPerSplat:72}}},2:{BytesPerCenter:6,BytesPerScale:6,BytesPerRotation:8,BytesPerColor:4,ScaleOffsetBytes:6,RotationffsetBytes:12,ColorOffsetBytes:20,SphericalHarmonicsOffsetBytes:24,ScaleRange:32767,BytesPerSphericalHarmonicsComponent:1,SphericalHarmonicsOffsetFloat:12,SphericalHarmonicsDegrees:{0:{BytesPerSplat:24},1:{BytesPerSplat:33},2:{BytesPerSplat:48}}}}),Z(j,"CovarianceSizeFloats",6),Z(j,"HeaderSizeBytes",4096),Z(j,"SectionHeaderSizeBytes",1024),Z(j,"BucketStorageSizeBytes",12),Z(j,"BucketStorageSizeFloats",3),Z(j,"BucketBlockSize",5),Z(j,"BucketSize",256),Z(j,"computeCovariance",function(){const e=new ke,t=new ze,n=new ze,i=new ze,r=new ze,a=new ze,o=new ze;return function(l,c,u,d,p=0,h){e.makeScale(l.x,l.y,l.z),t.setFromMatrix4(e),e.makeRotationFromQuaternion(c),n.setFromMatrix4(e),i.copy(n).multiply(t),r.copy(i).transpose().premultiply(i),u&&(a.setFromMatrix4(u),o.copy(a).transpose(),r.multiply(o),r.premultiply(a)),h>=1?(d[p]=Mt(r.elements[0]),d[p+1]=Mt(r.elements[3]),d[p+2]=Mt(r.elements[6]),d[p+3]=Mt(r.elements[4]),d[p+4]=Mt(r.elements[7]),d[p+5]=Mt(r.elements[8])):(d[p]=r.elements[0],d[p+1]=r.elements[3],d[p+2]=r.elements[6],d[p+3]=r.elements[4],d[p+4]=r.elements[7],d[p+5]=r.elements[8])}}()),Z(j,"dot3",(e,t,n,i,r)=>{r[0]=r[1]=r[2]=0;const a=i[0],o=i[1],l=i[2];j.addInto3(e[0]*a,e[1]*a,e[2]*a,r),j.addInto3(t[0]*o,t[1]*o,t[2]*o,r),j.addInto3(n[0]*l,n[1]*l,n[2]*l,r)}),Z(j,"addInto3",(e,t,n,i)=>{i[0]=i[0]+e,i[1]=i[1]+t,i[2]=i[2]+n}),Z(j,"dot5",(e,t,n,i,r,a,o)=>{o[0]=o[1]=o[2]=0;const l=a[0],c=a[1],u=a[2],d=a[3],p=a[4];j.addInto3(e[0]*l,e[1]*l,e[2]*l,o),j.addInto3(t[0]*c,t[1]*c,t[2]*c,o),j.addInto3(n[0]*u,n[1]*u,n[2]*u,o),j.addInto3(i[0]*d,i[1]*d,i[2]*d,o),j.addInto3(r[0]*p,r[1]*p,r[2]*p,o)}),Z(j,"rotateSphericalHarmonics3",(e,t,n,i,r,a,o,l,c)=>{j.dot3(e,t,n,i,o),j.dot3(e,t,n,r,l),j.dot3(e,t,n,a,c)}),Z(j,"rotateSphericalHarmonics5",(e,t,n,i,r,a,o,l,c,u,d,p,h,g,A,f,m,x)=>{const v=Math.sqrt(.25),y=Math.sqrt(3/4),T=Math.sqrt(1/3),E=Math.sqrt(4/3),_=Math.sqrt(1/12);c[0]=v*(l[2]*a[0]+l[0]*a[2]+(a[2]*l[0]+a[0]*l[2])),c[1]=l[1]*a[0]+a[1]*l[0],c[2]=y*(l[1]*a[1]+a[1]*l[1]),c[3]=l[1]*a[2]+a[1]*l[2],c[4]=v*(l[2]*a[2]-l[0]*a[0]+(a[2]*l[2]-a[0]*l[0])),j.dot5(e,t,n,i,r,c,g),u[0]=v*(o[2]*a[0]+o[0]*a[2]+(a[2]*o[0]+a[0]*o[2])),u[1]=o[1]*a[0]+a[1]*o[0],u[2]=y*(o[1]*a[1]+a[1]*o[1]),u[3]=o[1]*a[2]+a[1]*o[2],u[4]=v*(o[2]*a[2]-o[0]*a[0]+(a[2]*o[2]-a[0]*o[0])),j.dot5(e,t,n,i,r,u,A),d[0]=T*(o[2]*o[0]+o[0]*o[2])+-_*(l[2]*l[0]+l[0]*l[2]+(a[2]*a[0]+a[0]*a[2])),d[1]=E*o[1]*o[0]+-T*(l[1]*l[0]+a[1]*a[0]),d[2]=o[1]*o[1]+-v*(l[1]*l[1]+a[1]*a[1]),d[3]=E*o[1]*o[2]+-T*(l[1]*l[2]+a[1]*a[2]),d[4]=T*(o[2]*o[2]-o[0]*o[0])+-_*(l[2]*l[2]-l[0]*l[0]+(a[2]*a[2]-a[0]*a[0])),j.dot5(e,t,n,i,r,d,f),p[0]=v*(o[2]*l[0]+o[0]*l[2]+(l[2]*o[0]+l[0]*o[2])),p[1]=o[1]*l[0]+l[1]*o[0],p[2]=y*(o[1]*l[1]+l[1]*o[1]),p[3]=o[1]*l[2]+l[1]*o[2],p[4]=v*(o[2]*l[2]-o[0]*l[0]+(l[2]*o[2]-l[0]*o[0])),j.dot5(e,t,n,i,r,p,m),h[0]=v*(l[2]*l[0]+l[0]*l[2]-(a[2]*a[0]+a[0]*a[2])),h[1]=l[1]*l[0]-a[1]*a[0],h[2]=y*(l[1]*l[1]-a[1]*a[1]),h[3]=l[1]*l[2]-a[1]*a[2],h[4]=v*(l[2]*l[2]-l[0]*l[0]-(a[2]*a[2]-a[0]*a[0])),j.dot5(e,t,n,i,r,h,x)}),Z(j,"writeSplatDataToSectionBuffer",function(){const e=new ArrayBuffer(12),t=new ArrayBuffer(12),n=new ArrayBuffer(16),i=new ArrayBuffer(4),r=new ArrayBuffer(256),a=new ut,o=new I,l=new I,{X:c,Y:u,Z:d,SCALE0:p,SCALE1:h,SCALE2:g,ROTATION0:A,ROTATION1:f,ROTATION2:m,ROTATION3:x,FDC0:v,FDC1:y,FDC2:T,OPACITY:E,FRC0:_,FRC9:w}=de.OFFSET,O=(S,M,F)=>{const P=F*2+1;return S=Math.round(S*M)+F,ht(S,0,P)};return function(S,M,F,P,D,z,U,G,H=-Hn,Y=Hn){const ne=ki(D),le=j.CompressionLevels[P].BytesPerCenter,Be=j.CompressionLevels[P].BytesPerScale,Re=j.CompressionLevels[P].BytesPerRotation,X=j.CompressionLevels[P].BytesPerColor,$=F,re=$+le,ae=re+Be,ye=ae+Re,Ae=ye+X;if(S[A]!==void 0?(a.set(S[A],S[f],S[m],S[x]),a.normalize()):a.set(1,0,0,0),S[p]!==void 0?o.set(S[p]||0,S[h]||0,S[g]||0):o.set(0,0,0),P===0){const He=new Float32Array(M,$,j.CenterComponentCount),Oe=new Float32Array(M,ae,j.RotationComponentCount),L=new Float32Array(M,re,j.ScaleComponentCount);if(Oe.set([a.x,a.y,a.z,a.w]),L.set([o.x,o.y,o.z]),He.set([S[c],S[u],S[d]]),D>0){const Ke=new Float32Array(M,Ae,ne);if(D>=1){for(let Ce=0;Ce<9;Ce++)Ke[Ce]=S[_+Ce]||0;if(D>=2)for(let Ce=0;Ce<15;Ce++)Ke[Ce+9]=S[w+Ce]||0}}}else{const He=new Uint16Array(e,0,j.CenterComponentCount),Oe=new Uint16Array(n,0,j.RotationComponentCount),L=new Uint16Array(t,0,j.ScaleComponentCount);if(Oe.set([Mt(a.x),Mt(a.y),Mt(a.z),Mt(a.w)]),L.set([Mt(o.x),Mt(o.y),Mt(o.z)]),l.set(S[c],S[u],S[d]).sub(z),l.x=O(l.x,U,G),l.y=O(l.y,U,G),l.z=O(l.z,U,G),He.set([l.x,l.y,l.z]),D>0){const Ke=P===1?Uint16Array:Uint8Array,Ce=P===1?2:1,Ge=new Ke(r,0,ne);if(D>=1){for(let We=0;We<9;We++){const be=S[_+We]||0;Ge[We]=P===1?Mt(be):cs(be,H,Y)}const Pe=9*Ce;if(Di(Ge.buffer,0,M,Ae,Pe),D>=2){for(let We=0;We<15;We++){const be=S[w+We]||0;Ge[We+9]=P===1?Mt(be):cs(be,H,Y)}Di(Ge.buffer,Pe,M,Ae+Pe,15*Ce)}}}Di(He.buffer,0,M,$,6),Di(L.buffer,0,M,re,6),Di(Oe.buffer,0,M,ae,8)}const Ie=new Uint8ClampedArray(i,0,4);Ie.set([S[v]||0,S[y]||0,S[T]||0]),Ie[3]=S[E]||0,Di(Ie.buffer,0,M,ye,4)}}());let _e=j;const Ol=new Uint8Array([112,108,121,10]),Nl=new Uint8Array([10,101,110,100,95,104,101,97,100,101,114,10]),aa="end_header",oa=new Map([["char",Int8Array],["uchar",Uint8Array],["short",Int16Array],["ushort",Uint16Array],["int",Int32Array],["uint",Uint32Array],["float",Float32Array],["double",Float64Array]]),gn=(s,e)=>{const t=(1<<e)-1;return(s&t)/t},zl=(s,e)=>{s.x=gn(e>>>21,11),s.y=gn(e>>>11,10),s.z=gn(e,11)},zg=(s,e)=>{s.x=gn(e>>>24,8),s.y=gn(e>>>16,8),s.z=gn(e>>>8,8),s.w=gn(e,8)},kg=(s,e)=>{const t=1/(Math.sqrt(2)*.5),n=(gn(e>>>20,10)-.5)*t,i=(gn(e>>>10,10)-.5)*t,r=(gn(e,10)-.5)*t,a=Math.sqrt(1-(n*n+i*i+r*r));switch(e>>>30){case 0:s.set(a,n,i,r);break;case 1:s.set(n,a,i,r);break;case 2:s.set(n,i,a,r);break;case 3:s.set(n,i,r,a);break}},Tn=(s,e,t)=>s*(1-t)+e*t,pt=(s,e)=>{var t;return(t=s.properties.find(n=>n.name===e&&n.storage))==null?void 0:t.storage},rt=class rt{static decodeHeaderText(e){let t,n,i,r;const a=e.split(`
`).filter(d=>!d.startsWith("comment "));let o=0,l=!1;for(let d=1;d<a.length;++d){const p=a[d].split(" ");switch(p[0]){case"format":if(p[1]!=="binary_little_endian")throw new Error("Unsupported ply format");break;case"element":t={name:p[1],count:parseInt(p[2],10),properties:[],storageSizeBytes:0},t.name==="chunk"?n=t:t.name==="vertex"?i=t:t.name==="sh"&&(r=t);break;case"property":{if(!oa.has(p[1]))throw new Error(`Unrecognized property data type '${p[1]}' in ply header`);const h=oa.get(p[1]),g=h.BYTES_PER_ELEMENT*t.count;t.name==="vertex"&&(o+=h.BYTES_PER_ELEMENT),t.properties.push({type:p[1],name:p[2],storage:null,byteSize:h.BYTES_PER_ELEMENT,storageSizeByes:g}),t.storageSizeBytes+=g;break}case aa:l=!0;break;default:throw new Error(`Unrecognized header value '${p[0]}' in ply header`)}if(l)break}let c=0,u=0;return r&&(u=r.properties.length,r.properties.length>=45?c=3:r.properties.length>=24?c=2:r.properties.length>=9&&(c=1)),{chunkElement:n,vertexElement:i,shElement:r,bytesPerSplat:o,headerSizeBytes:e.indexOf(aa)+aa.length+1,sphericalHarmonicsDegree:c,sphericalHarmonicsPerSplat:u}}static decodeHeader(e){const t=(h,g)=>{const A=h.length-g.length;let f,m;for(f=0;f<=A;++f){for(m=0;m<g.length&&h[f+m]===g[m];++m);if(m===g.length)return f}return-1},n=(h,g)=>{if(h.length<g.length)return!1;for(let A=0;A<g.length;++A)if(h[A]!==g[A])return!1;return!0};let i=new Uint8Array(e),r;if(i.length>=Ol.length&&!n(i,Ol))throw new Error("Invalid PLY header");if(r=t(i,Nl),r===-1)throw new Error("End of PLY header not found");const a=new TextDecoder("ascii").decode(i.slice(0,r)),{chunkElement:o,vertexElement:l,shElement:c,sphericalHarmonicsDegree:u,sphericalHarmonicsPerSplat:d,bytesPerSplat:p}=rt.decodeHeaderText(a);return{headerSizeBytes:r+Nl.length,bytesPerSplat:p,chunkElement:o,vertexElement:l,shElement:c,sphericalHarmonicsDegree:u,sphericalHarmonicsPerSplat:d}}static readElementData(e,t,n,i,r,a=null){let o=t instanceof DataView?t:new DataView(t);i=i||0,r=r||e.count-1;for(let l=i;l<=r;++l)for(let c=0;c<e.properties.length;++c){const u=e.properties[c],d=oa.get(u.type),p=d.BYTES_PER_ELEMENT*e.count;if((!u.storage||u.storage.byteLength<p)&&(!a||a(u.name))&&(u.storage=new d(e.count)),u.storage)switch(u.type){case"char":u.storage[l]=o.getInt8(n);break;case"uchar":u.storage[l]=o.getUint8(n);break;case"short":u.storage[l]=o.getInt16(n,!0);break;case"ushort":u.storage[l]=o.getUint16(n,!0);break;case"int":u.storage[l]=o.getInt32(n,!0);break;case"uint":u.storage[l]=o.getUint32(n,!0);break;case"float":u.storage[l]=o.getFloat32(n,!0);break;case"double":u.storage[l]=o.getFloat64(n,!0);break}n+=u.byteSize}return n}static readPly(e,t=null){const n=rt.decodeHeader(e);let i=rt.readElementData(n.chunkElement,e,n.headerSizeBytes,null,null,t);return i=rt.readElementData(n.vertexElement,e,i,null,null,t),rt.readElementData(n.shElement,e,i,null,null,t),{chunkElement:n.chunkElement,vertexElement:n.vertexElement,shElement:n.shElement,sphericalHarmonicsDegree:n.sphericalHarmonicsDegree,sphericalHarmonicsPerSplat:n.sphericalHarmonicsPerSplat}}static getElementStorageArrays(e,t,n){const i={};if(t){const r=pt(e,"min_r"),a=pt(e,"min_g"),o=pt(e,"min_b"),l=pt(e,"max_r"),c=pt(e,"max_g"),u=pt(e,"max_b"),d=pt(e,"min_x"),p=pt(e,"min_y"),h=pt(e,"min_z"),g=pt(e,"max_x"),A=pt(e,"max_y"),f=pt(e,"max_z"),m=pt(e,"min_scale_x"),x=pt(e,"min_scale_y"),v=pt(e,"min_scale_z"),y=pt(e,"max_scale_x"),T=pt(e,"max_scale_y"),E=pt(e,"max_scale_z"),_=pt(t,"packed_position"),w=pt(t,"packed_rotation"),O=pt(t,"packed_scale"),S=pt(t,"packed_color");i.colorExtremes={minR:r,maxR:l,minG:a,maxG:c,minB:o,maxB:u},i.positionExtremes={minX:d,maxX:g,minY:p,maxY:A,minZ:h,maxZ:f},i.scaleExtremes={minScaleX:m,maxScaleX:y,minScaleY:x,maxScaleY:T,minScaleZ:v,maxScaleZ:E},i.position=_,i.rotation=w,i.scale=O,i.color=S}if(n){const r={};for(let a=0;a<45;a++){const o=`f_rest_${a}`,l=pt(n,o);if(l)r[o]=l;else break}i.sh=r}return i}static parseToUncompressedSplatBufferSection(e,t,n,i,r,a,o,l,c=null){rt.readElementData(t,a,0,n,i,c);const u=_e.CompressionLevels[0].SphericalHarmonicsDegrees[0].BytesPerSplat,{positionExtremes:d,scaleExtremes:p,colorExtremes:h,position:g,rotation:A,scale:f,color:m}=rt.getElementStorageArrays(e,t),x=de.createSplat();for(let v=n;v<=i;++v){rt.decompressBaseSplat(v,r,g,d,f,p,A,h,m,x);const y=v*u+l;_e.writeSplatDataToSectionBuffer(x,o,y,0,0)}}static parseToUncompressedSplatArraySection(e,t,n,i,r,a,o,l=null){rt.readElementData(t,a,0,n,i,l);const{positionExtremes:c,scaleExtremes:u,colorExtremes:d,position:p,rotation:h,scale:g,color:A}=rt.getElementStorageArrays(e,t);for(let f=n;f<=i;++f){const m=de.createSplat();rt.decompressBaseSplat(f,r,p,c,g,u,h,d,A,m),o.addSplat(m)}}static parseSphericalHarmonicsToUncompressedSplatArraySection(e,t,n,i,r,a,o,l,c,u=null){rt.readElementData(t,r,a,n,i,u);const{sh:d}=rt.getElementStorageArrays(e,void 0,t),p=Object.values(d);for(let h=n;h<=i;++h)rt.decompressSphericalHarmonics(h,p,o,l,c.splats[h])}static parseToUncompressedSplatArray(e,t){const{chunkElement:n,vertexElement:i,shElement:r,sphericalHarmonicsDegree:a}=rt.readPly(e);t=Math.min(t,a);const o=new de(t),{positionExtremes:l,scaleExtremes:c,colorExtremes:u,position:d,rotation:p,scale:h,color:g}=rt.getElementStorageArrays(n,i);let A;if(t>0){const{sh:f}=rt.getElementStorageArrays(n,void 0,r);A=Object.values(f)}for(let f=0;f<i.count;++f){o.addDefaultSplat();const m=o.getSplat(o.splatCount-1);rt.decompressBaseSplat(f,0,d,l,h,c,p,u,g,m),t>0&&rt.decompressSphericalHarmonics(f,A,t,a,m)}return o}static parseToUncompressedSplatBuffer(e,t){const{chunkElement:n,vertexElement:i,shElement:r,sphericalHarmonicsDegree:a}=rt.readPly(e);t=Math.min(t,a);const{splatBuffer:o,splatBufferDataOffsetBytes:l}=_e.preallocateUncompressed(i.count,t),{positionExtremes:c,scaleExtremes:u,colorExtremes:d,position:p,rotation:h,scale:g,color:A}=rt.getElementStorageArrays(n,i);let f;if(t>0){const{sh:v}=rt.getElementStorageArrays(n,void 0,r);f=Object.values(v)}const m=_e.CompressionLevels[0].SphericalHarmonicsDegrees[t].BytesPerSplat,x=de.createSplat(t);for(let v=0;v<i.count;++v){rt.decompressBaseSplat(v,0,p,c,g,u,h,d,A,x),t>0&&rt.decompressSphericalHarmonics(v,f,t,a,x);const y=v*m+l;_e.writeSplatDataToSectionBuffer(x,o.bufferData,y,0,t)}return o}};Z(rt,"decompressBaseSplat",function(){const e=new I,t=new ut,n=new I,i=new ft,r=de.OFFSET;return function(a,o,l,c,u,d,p,h,g,A){A=A||de.createSplat();const f=Math.floor((o+a)/256);return zl(e,l[a]),kg(t,p[a]),zl(n,u[a]),zg(i,g[a]),A[r.X]=Tn(c.minX[f],c.maxX[f],e.x),A[r.Y]=Tn(c.minY[f],c.maxY[f],e.y),A[r.Z]=Tn(c.minZ[f],c.maxZ[f],e.z),A[r.ROTATION0]=t.x,A[r.ROTATION1]=t.y,A[r.ROTATION2]=t.z,A[r.ROTATION3]=t.w,A[r.SCALE0]=Math.exp(Tn(d.minScaleX[f],d.maxScaleX[f],n.x)),A[r.SCALE1]=Math.exp(Tn(d.minScaleY[f],d.maxScaleY[f],n.y)),A[r.SCALE2]=Math.exp(Tn(d.minScaleZ[f],d.maxScaleZ[f],n.z)),h.minR&&h.maxR?A[r.FDC0]=ht(Math.round(Tn(h.minR[f],h.maxR[f],i.x)*255),0,255):A[r.FDC0]=ht(Math.floor(i.x*255),0,255),h.minG&&h.maxG?A[r.FDC1]=ht(Math.round(Tn(h.minG[f],h.maxG[f],i.y)*255),0,255):A[r.FDC1]=ht(Math.floor(i.y*255),0,255),h.minB&&h.maxB?A[r.FDC2]=ht(Math.round(Tn(h.minB[f],h.maxB[f],i.z)*255),0,255):A[r.FDC2]=ht(Math.floor(i.z*255),0,255),A[r.OPACITY]=ht(Math.floor(i.w*255),0,255),A}}()),Z(rt,"decompressSphericalHarmonics",function(){const e=[0,3,8,15],t=[0,1,2,9,10,11,12,13,24,25,26,27,28,29,30,3,4,5,14,15,16,17,18,31,32,33,34,35,36,37,6,7,8,19,20,21,22,23,38,39,40,41,42,43,44];return function(n,i,r,a,o){o=o||de.createSplat();let l=e[r],c=e[a];for(let u=0;u<3;++u)for(let d=0;d<15;++d){const p=t[u*15+d];d<l&&d<c&&(o[de.OFFSET.FRC0+p]=i[u*c+d][n]*(8/255)-4)}return o}}());let In=rt;const Ut={INRIAV1:0,INRIAV2:1,PlayCanvasCompressed:2},[Yc,yo,Mo,Co,Eo,To,bo]=[0,1,2,3,4,5,6],kl={double:Yc,int:yo,uint:Mo,float:Co,short:Eo,ushort:To,uchar:bo},Hg={[Yc]:8,[yo]:4,[Mo]:4,[Co]:4,[Eo]:2,[To]:2,[bo]:1},kt=class kt{static decodeSectionHeader(e,t,n=0){const i=[];let r=!1,a=-1,o=0,l=!1,c=null;const u=[],d=[],p=[],h={};for(let m=n;m<e.length;m++){const x=e[m].trim();if(x.startsWith("element"))if(r){a--;break}else{r=!0,n=m,a=m;const v=x.split(" ");let y=0;for(let T of v){const E=T.trim();E.length>0&&(y++,y===2?c=E:y===3&&(o=parseInt(E)))}}else if(x.startsWith("property")){const v=x.match(/(\w+)\s+(\w+)\s+(\w+)/);if(v){const y=v[2],T=v[3];p.push(T);const E=t[T];h[T]=y;const _=kl[y];E!==void 0&&(u.push(E),d[E]=_)}}if(x===kt.HeaderEndToken){l=!0;break}r&&(i.push(x),a++)}const g=[];let A=0;for(let m of p){const x=h[m];if(h.hasOwnProperty(m)){const v=t[m];v!==void 0&&(g[v]=A)}A+=Hg[kl[x]]}const f=kt.decodeSphericalHarmonicsFromSectionHeader(p,t);return{headerLines:i,headerStartLine:n,headerEndLine:a,fieldTypes:d,fieldIds:u,fieldOffsets:g,bytesPerVertex:A,vertexCount:o,dataSizeBytes:A*o,endOfHeader:l,sectionName:c,sphericalHarmonicsDegree:f.degree,sphericalHarmonicsCoefficientsPerChannel:f.coefficientsPerChannel,sphericalHarmonicsDegree1Fields:f.degree1Fields,sphericalHarmonicsDegree2Fields:f.degree2Fields}}static decodeSphericalHarmonicsFromSectionHeader(e,t){let n=0,i=0;for(let l of e)l.startsWith("f_rest")&&n++;i=n/3;let r=0;i>=3&&(r=1),i>=8&&(r=2);let a=[],o=[];for(let l=0;l<3;l++){if(r>=1)for(let c=0;c<3;c++)a.push(t["f_rest_"+(c+i*l)]);if(r>=2)for(let c=0;c<5;c++)o.push(t["f_rest_"+(c+i*l+3)])}return{degree:r,coefficientsPerChannel:i,degree1Fields:a,degree2Fields:o}}static getHeaderSectionNames(e){const t=[];for(let n of e)if(n.startsWith("element")){const i=n.split(" ");let r=0;for(let a of i){const o=a.trim();o.length>0&&(r++,r===2&&t.push(o))}}return t}static checkTextForEndHeader(e){return!!e.includes(kt.HeaderEndToken)}static checkBufferForEndHeader(e,t,n,i){const r=new Uint8Array(e,Math.max(0,t-n),n),a=i.decode(r);return kt.checkTextForEndHeader(a)}static extractHeaderFromBufferToText(e){const t=new TextDecoder;let n=0,i="";const r=100;for(;;){if(n+r>=e.byteLength)throw new Error("End of file reached while searching for end of header");const a=new Uint8Array(e,n,r);if(i+=t.decode(a),n+=r,kt.checkBufferForEndHeader(e,n,r*2,t))break}return i}static readHeaderFromBuffer(e){const t=new TextDecoder;let n=0,i="";const r=100;for(;;){if(n+r>=e.byteLength)throw new Error("End of file reached while searching for end of header");const a=new Uint8Array(e,n,r);if(i+=t.decode(a),n+=r,kt.checkBufferForEndHeader(e,n,r*2,t))break}return i}static convertHeaderTextToLines(e){const t=e.split(`
`),n=[];for(let i=0;i<t.length;i++){const r=t[i].trim();if(n.push(r),r===kt.HeaderEndToken)break}return n}static determineHeaderFormatFromHeaderText(e){const t=kt.convertHeaderTextToLines(e);let n=Ut.INRIAV1;for(let i=0;i<t.length;i++){const r=t[i].trim();if(r.startsWith("element chunk")||r.match(/[A-Za-z]*packed_[A-Za-z]*/))n=Ut.PlayCanvasCompressed;else if(r.startsWith("element codebook_centers"))n=Ut.INRIAV2;else if(r===kt.HeaderEndToken)break}return n}static determineHeaderFormatFromPlyBuffer(e){const t=kt.extractHeaderFromBufferToText(e);return kt.determineHeaderFormatFromHeaderText(t)}static readVertex(e,t,n,i,r,a,o=!0){const l=n*t.bytesPerVertex+i,c=t.fieldOffsets,u=t.fieldTypes;for(let d of r){const p=u[d];p===Co?a[d]=e.getFloat32(l+c[d],!0):p===Eo?a[d]=e.getInt16(l+c[d],!0):p===To?a[d]=e.getUint16(l+c[d],!0):p===yo?a[d]=e.getInt32(l+c[d],!0):p===Mo?a[d]=e.getUint32(l+c[d],!0):p===bo&&(o?a[d]=e.getUint8(l+c[d])/255:a[d]=e.getUint8(l+c[d]))}}};Z(kt,"HeaderEndToken","end_header");let xt=kt;const Kc=["scale_0","scale_1","scale_2","rot_0","rot_1","rot_2","rot_3","x","y","z","f_dc_0","f_dc_1","f_dc_2","opacity","red","green","blue","f_rest_0"],Vg=Kc.map((s,e)=>e),[Hl,Gg,Wg,Xg,qg,Qg,Yg,Kg,jg,Zg,Vl,$g,Jg,Gl,Wl,e0,t0,n0]=Vg,Jt=class Jt{static decodeHeaderLines(e){let t=0;e.forEach(u=>{u.includes("f_rest_")&&t++});let n=0;t>=45?n=45:t>=24?n=24:t>=9&&(n=9);let r=Array.from(Array(Math.max(n-1,0))).map((u,d)=>`f_rest_${d+1}`);const a=[...Kc,...r],o=a.map((u,d)=>d),l=o.reduce((u,d)=>(u[a[d]]=d,u),{}),c=xt.decodeSectionHeader(e,l,0);return c.splatCount=c.vertexCount,c.bytesPerSplat=c.bytesPerVertex,c.fieldsToReadIndexes=o,c}static decodeHeaderText(e){const t=xt.convertHeaderTextToLines(e),n=Jt.decodeHeaderLines(t);return n.headerText=e,n.headerSizeBytes=e.indexOf(xt.HeaderEndToken)+xt.HeaderEndToken.length+1,n}static decodeHeaderFromBuffer(e){const t=xt.readHeaderFromBuffer(e);return Jt.decodeHeaderText(t)}static findSplatData(e,t){return new DataView(e,t.headerSizeBytes)}static parseToUncompressedSplatBufferSection(e,t,n,i,r,a,o,l=0){l=Math.min(l,e.sphericalHarmonicsDegree);const c=_e.CompressionLevels[0].SphericalHarmonicsDegrees[l].BytesPerSplat;for(let u=t;u<=n;u++){const d=Jt.parseToUncompressedSplat(i,u,e,r,l),p=u*c+o;_e.writeSplatDataToSectionBuffer(d,a,p,0,l)}}static parseToUncompressedSplatArraySection(e,t,n,i,r,a,o=0){o=Math.min(o,e.sphericalHarmonicsDegree);for(let l=t;l<=n;l++){const c=Jt.parseToUncompressedSplat(i,l,e,r,o);a.addSplat(c)}}static decodeSectionSplatData(e,t,n,i,r=!0){if(i=Math.min(i,n.sphericalHarmonicsDegree),r){const a=new de(i);for(let o=0;o<t;o++){const l=Jt.parseToUncompressedSplat(e,o,n,0,i);a.addSplat(l)}return a}else{const{splatBuffer:a,splatBufferDataOffsetBytes:o}=_e.preallocateUncompressed(t,i);return Jt.parseToUncompressedSplatBufferSection(n,0,t-1,e,0,a.bufferData,o,i),a}}static readSplat(e,t,n,i,r){return xt.readVertex(e,t,n,i,t.fieldsToReadIndexes,r,!0)}static parseToUncompressedSplatArray(e,t=0){const{header:n,splatCount:i,splatData:r}=Xl(e);return Jt.decodeSectionSplatData(r,i,n,t,!0)}static parseToUncompressedSplatBuffer(e,t=0){const{header:n,splatCount:i,splatData:r}=Xl(e);return Jt.decodeSectionSplatData(r,i,n,t,!1)}};Z(Jt,"parseToUncompressedSplat",function(){let e=[];const t=new ut,n=de.OFFSET.X,i=de.OFFSET.Y,r=de.OFFSET.Z,a=de.OFFSET.SCALE0,o=de.OFFSET.SCALE1,l=de.OFFSET.SCALE2,c=de.OFFSET.ROTATION0,u=de.OFFSET.ROTATION1,d=de.OFFSET.ROTATION2,p=de.OFFSET.ROTATION3,h=de.OFFSET.FDC0,g=de.OFFSET.FDC1,A=de.OFFSET.FDC2,f=de.OFFSET.OPACITY,m=[];for(let x=0;x<45;x++)m[x]=de.OFFSET.FRC0+x;return function(x,v,y,T=0,E=0){E=Math.min(E,y.sphericalHarmonicsDegree),Jt.readSplat(x,y,v,T,e);const _=de.createSplat(E);if(e[Hl]!==void 0?(_[a]=Math.exp(e[Hl]),_[o]=Math.exp(e[Gg]),_[l]=Math.exp(e[Wg])):(_[a]=.01,_[o]=.01,_[l]=.01),e[Vl]!==void 0){const w=.28209479177387814;_[h]=(.5+w*e[Vl])*255,_[g]=(.5+w*e[$g])*255,_[A]=(.5+w*e[Jg])*255}else e[Wl]!==void 0?(_[h]=e[Wl]*255,_[g]=e[e0]*255,_[A]=e[t0]*255):(_[h]=0,_[g]=0,_[A]=0);if(e[Gl]!==void 0&&(_[f]=1/(1+Math.exp(-e[Gl]))*255),_[h]=ht(Math.floor(_[h]),0,255),_[g]=ht(Math.floor(_[g]),0,255),_[A]=ht(Math.floor(_[A]),0,255),_[f]=ht(Math.floor(_[f]),0,255),E>=1&&e[n0]!==void 0){for(let w=0;w<9;w++)_[m[w]]=e[y.sphericalHarmonicsDegree1Fields[w]];if(E>=2)for(let w=0;w<15;w++)_[m[9+w]]=e[y.sphericalHarmonicsDegree2Fields[w]]}return t.set(e[Xg],e[qg],e[Qg],e[Yg]),t.normalize(),_[c]=t.x,_[u]=t.y,_[d]=t.z,_[p]=t.w,_[n]=e[Kg],_[i]=e[jg],_[r]=e[Zg],_}}());let Dn=Jt;function Xl(s){const e=Dn.decodeHeaderFromBuffer(s),t=e.splatCount,n=Dn.findSplatData(s,e);return{header:e,splatCount:t,splatData:n}}const jc=["features_dc","features_rest_0","features_rest_1","features_rest_2","features_rest_3","features_rest_4","features_rest_5","features_rest_6","features_rest_7","features_rest_8","features_rest_9","features_rest_10","features_rest_11","features_rest_12","features_rest_13","features_rest_14","opacity","scaling","rotation_re","rotation_im"],qs=jc.map((s,e)=>e),[Qs,i0,s0,ql,Ys,r0,la]=[0,1,4,16,17,18,19],Zc=["scale_0","scale_1","scale_2","rot_0","rot_1","rot_2","rot_3","x","y","z","f_dc_0","f_dc_1","f_dc_2","opacity","red","green","blue","f_rest_0","f_rest_1","f_rest_2","f_rest_3","f_rest_4","f_rest_5","f_rest_6","f_rest_7","f_rest_8","f_rest_9","f_rest_10","f_rest_11","f_rest_12","f_rest_13","f_rest_14","f_rest_15","f_rest_16","f_rest_17","f_rest_18","f_rest_19","f_rest_20","f_rest_21","f_rest_22","f_rest_23","f_rest_24","f_rest_25","f_rest_26","f_rest_27","f_rest_28","f_rest_29","f_rest_30","f_rest_31","f_rest_32","f_rest_33","f_rest_34","f_rest_35","f_rest_36","f_rest_37","f_rest_38","f_rest_39","f_rest_40","f_rest_41","f_rest_42","f_rest_43","f_rest_44","f_rest_45"],$a=Zc.map((s,e)=>e),[Ql,a0,o0,l0,c0,u0,d0,h0,f0,p0,Ja,$c,Jc,Yl]=$a,Kl=Ja,m0=$c,g0=Jc,Ks=s=>{const e=(31744&s)>>10,t=1023&s;return(s>>15?-1:1)*(e?e===31?t?NaN:1/0:Math.pow(2,e-15)*(1+t/1024):t/1024*6103515625e-14)},Ht=class Ht{static decodeSectionHeadersFromHeaderLines(e){const t=$a.reduce((u,d)=>(u[Zc[d]]=d,u),{}),n=qs.reduce((u,d)=>(u[jc[d]]=d,u),{}),i=xt.getHeaderSectionNames(e);let r;for(let u=0;u<i.length;u++)i[u]==="codebook_centers"&&(r=u);let a=0,o=!1;const l=[];let c=0;for(;!o;){let u;c===r?u=xt.decodeSectionHeader(e,n,a):u=xt.decodeSectionHeader(e,t,a),o=u.endOfHeader,a=u.headerEndLine+1,o||(u.splatCount=u.vertexCount,u.bytesPerSplat=u.bytesPerVertex),l.push(u),c++}return l}static decodeSectionHeadersFromHeaderText(e){const t=xt.convertHeaderTextToLines(e);return Ht.decodeSectionHeadersFromHeaderLines(t)}static getSplatCountFromSectionHeaders(e){let t=0;for(let n of e)n.sectionName!=="codebook_centers"&&(t+=n.vertexCount);return t}static decodeHeaderFromHeaderText(e){const t=e.indexOf(xt.HeaderEndToken)+xt.HeaderEndToken.length+1,n=Ht.decodeSectionHeadersFromHeaderText(e),i=Ht.getSplatCountFromSectionHeaders(n);return{headerSizeBytes:t,sectionHeaders:n,splatCount:i}}static decodeHeaderFromBuffer(e){const t=xt.readHeaderFromBuffer(e);return Ht.decodeHeaderFromHeaderText(t)}static findVertexData(e,t,n){let i=t.headerSizeBytes;for(let r=0;r<n&&r<t.sectionHeaders.length;r++){const a=t.sectionHeaders[r];i+=a.dataSizeBytes}return new DataView(e,i,t.sectionHeaders[n].dataSizeBytes)}static decodeCodeBook(e,t){const n=[],i=[];for(let r=0;r<t.vertexCount;r++){xt.readVertex(e,t,r,0,qs,n);for(let a of qs){const o=qs[a];let l=i[o];l||(i[o]=l=[]),l.push(n[a])}}for(let r=0;r<i.length;r++){const a=i[r],o=.28209479177387814;for(let l=0;l<a.length;l++){const c=Ks(a[l]);r===ql?a[l]=Math.round(1/(1+Math.exp(-c))*255):r===Qs?a[l]=Math.round((.5+o*c)*255):r===Ys?a[l]=Math.exp(c):a[l]=c}}return i}static decodeSectionSplatData(e,t,n,i,r){r=Math.min(r,n.sphericalHarmonicsDegree);const a=new de(r);for(let o=0;o<t;o++){const l=Ht.parseToUncompressedSplat(e,o,n,i,0,r);a.addSplat(l)}return a}static readSplat(e,t,n,i,r){return xt.readVertex(e,t,n,i,$a,r,!1)}static parseToUncompressedSplatArray(e,t=0){const n=[],i=Ht.decodeHeaderFromBuffer(e,t);let r;for(let o=0;o<i.sectionHeaders.length;o++){const l=i.sectionHeaders[o];if(l.sectionName==="codebook_centers"){const c=Ht.findVertexData(e,i,o);r=Ht.decodeCodeBook(c,l)}}for(let o=0;o<i.sectionHeaders.length;o++){const l=i.sectionHeaders[o];if(l.sectionName!=="codebook_centers"){const c=l.vertexCount,u=Ht.findVertexData(e,i,o),d=Ht.decodeSectionSplatData(u,c,l,r,t);n.push(d)}}const a=new de(t);for(let o of n)for(let l of o.splats)a.addSplat(l);return a}};Z(Ht,"parseToUncompressedSplat",function(){let e=[];const t=new ut,n=de.OFFSET.X,i=de.OFFSET.Y,r=de.OFFSET.Z,a=de.OFFSET.SCALE0,o=de.OFFSET.SCALE1,l=de.OFFSET.SCALE2,c=de.OFFSET.ROTATION0,u=de.OFFSET.ROTATION1,d=de.OFFSET.ROTATION2,p=de.OFFSET.ROTATION3,h=de.OFFSET.FDC0,g=de.OFFSET.FDC1,A=de.OFFSET.FDC2,f=de.OFFSET.OPACITY,m=[];for(let x=0;x<45;x++)m[x]=de.OFFSET.FRC0+x;return function(x,v,y,T,E=0,_=0){_=Math.min(_,y.sphericalHarmonicsDegree),Ht.readSplat(x,y,v,E,e);const w=de.createSplat(_);if(e[Ql]!==void 0?(w[a]=T[Ys][e[Ql]],w[o]=T[Ys][e[a0]],w[l]=T[Ys][e[o0]]):(w[a]=.01,w[o]=.01,w[l]=.01),e[Ja]!==void 0?(w[h]=T[Qs][e[Ja]],w[g]=T[Qs][e[$c]],w[A]=T[Qs][e[Jc]]):e[Kl]!==void 0?(w[h]=e[Kl]*255,w[g]=e[m0]*255,w[A]=e[g0]*255):(w[h]=0,w[g]=0,w[A]=0),e[Yl]!==void 0&&(w[f]=T[ql][e[Yl]]),w[h]=ht(Math.floor(w[h]),0,255),w[g]=ht(Math.floor(w[g]),0,255),w[A]=ht(Math.floor(w[A]),0,255),w[f]=ht(Math.floor(w[f]),0,255),_>=1&&y.sphericalHarmonicsDegree>=1){for(let P=0;P<9;P++){const D=T[i0+P%3];w[m[P]]=D[e[y.sphericalHarmonicsDegree1Fields[P]]]}if(_>=2&&y.sphericalHarmonicsDegree>=2)for(let P=0;P<15;P++){const D=T[s0+P%5];w[m[9+P]]=D[e[y.sphericalHarmonicsDegree2Fields[P]]]}}const O=T[r0][e[l0]],S=T[la][e[c0]],M=T[la][e[u0]],F=T[la][e[d0]];return t.set(O,S,M,F),t.normalize(),w[c]=t.x,w[u]=t.y,w[d]=t.z,w[p]=t.w,w[n]=Ks(e[h0]),w[i]=Ks(e[f0]),w[r]=Ks(e[p0]),w}}());let eo=Ht;class jl{static parseToUncompressedSplatArray(e,t=0){const n=xt.determineHeaderFormatFromPlyBuffer(e);if(n===Ut.PlayCanvasCompressed)return In.parseToUncompressedSplatArray(e,t);if(n===Ut.INRIAV1)return Dn.parseToUncompressedSplatArray(e,t);if(n===Ut.INRIAV2)return eo.parseToUncompressedSplatArray(e,t)}static parseToUncompressedSplatBuffer(e,t=0){const n=xt.determineHeaderFormatFromPlyBuffer(e);if(n===Ut.PlayCanvasCompressed)return In.parseToUncompressedSplatBuffer(e,t);if(n===Ut.INRIAV1)return Dn.parseToUncompressedSplatBuffer(e,t);if(n===Ut.INRIAV2)throw new Error("parseToUncompressedSplatBuffer() is not implemented for INRIA V2 PLY files")}}class wo{constructor(e,t,n,i){this.sectionCount=e,this.sectionFilters=t,this.groupingParameters=n,this.partitionGenerator=i}partitionUncompressedSplatArray(e){let t,n,i;if(this.partitionGenerator){const a=this.partitionGenerator(e);t=a.groupingParameters,n=a.sectionCount,i=a.sectionFilters}else t=this.groupingParameters,n=this.sectionCount,i=this.sectionFilters;const r=[];for(let a=0;a<n;a++){const o=new de(e.sphericalHarmonicsDegree),l=i[a];for(let c=0;c<e.splatCount;c++)l(c)&&o.addSplat(e.splats[c]);r.push(o)}return{splatArrays:r,parameters:t}}static getStandardPartitioner(e=0,t=new I,n=_e.BucketBlockSize,i=_e.BucketSize){const r=a=>{const o=de.OFFSET.X,l=de.OFFSET.Y,c=de.OFFSET.Z;e<=0&&(e=a.splatCount);const u=new I,d=.5,p=m=>{m.x=Math.floor(m.x/d)*d,m.y=Math.floor(m.y/d)*d,m.z=Math.floor(m.z/d)*d};a.splats.forEach(m=>{u.set(m[o],m[l],m[c]).sub(t),p(u),m.centerDist=u.lengthSq()}),a.splats.sort((m,x)=>{let v=m.centerDist,y=x.centerDist;return v>y?1:-1});const h=[],g=[];e=Math.min(a.splatCount,e);const A=Math.ceil(a.splatCount/e);let f=0;for(let m=0;m<A;m++){let x=f;h.push(v=>v>=x&&v<x+e),g.push({blocksSize:n,bucketSize:i}),f+=e}return{sectionCount:h.length,sectionFilters:h,groupingParameters:g}};return new wo(void 0,void 0,void 0,r)}}class _s{constructor(e,t,n,i,r,a,o){this.splatPartitioner=e,this.alphaRemovalThreshold=t,this.compressionLevel=n,this.sectionSize=i,this.sceneCenter=r?new I().copy(r):void 0,this.blockSize=a,this.bucketSize=o}generateFromUncompressedSplatArray(e){const t=this.splatPartitioner.partitionUncompressedSplatArray(e);return _e.generateFromUncompressedSplatArrays(t.splatArrays,this.alphaRemovalThreshold,this.compressionLevel,this.sceneCenter,this.blockSize,this.bucketSize,t.parameters)}static getStandardGenerator(e=1,t=1,n=0,i=new I,r=_e.BucketBlockSize,a=_e.BucketSize){const o=wo.getStandardPartitioner(n,i,r,a);return new _s(o,e,t,n,i,r,a)}}const vt={Downloading:0,Processing:1,Done:2};class fr extends Error{constructor(e){super(e)}}const ct={ProgressiveToSplatBuffer:0,ProgressiveToSplatArray:1,DownloadBeforeProcessing:2};function Zl(s,e){let t=0;for(let i of s)t+=i.sizeBytes;(!e||e.byteLength<t)&&(e=new ArrayBuffer(t));let n=0;for(let i of s)new Uint8Array(e,n,i.sizeBytes).set(i.data),n+=i.sizeBytes;return e}function $l(s,e,t,n,i,r,a,o){return e?_s.getStandardGenerator(t,n,i,r,a,o).generateFromUncompressedSplatArray(s):_e.generateFromUncompressedSplatArrays([s],t,0,new I)}class Ro{static loadFromURL(e,t,n,i,r,a,o=!0,l=0,c,u,d,p,h){let g;!n&&!o?g=ct.DownloadBeforeProcessing:o?g=ct.ProgressiveToSplatArray:g=ct.ProgressiveToSplatBuffer;const A=Qe.ProgressiveLoadSectionSize,f=_e.HeaderSizeBytes+_e.SectionHeaderSizeBytes,m=1;let x,v,y,T,E,_=0,w=0,O=0,S=!1,M=!1,F=!1;const P=So();let D=0,z=0,U=0,G=0,H="",Y=null,ne=[],le;const Be=new TextDecoder,Re=(X,$,re)=>{const ae=X>=100;if(re&&(ne.push({data:re,sizeBytes:re.byteLength,startBytes:U,endBytes:U+re.byteLength}),U+=re.byteLength),g===ct.DownloadBeforeProcessing)ae&&P.resolve(ne);else{if(S){if(x===Ut.PlayCanvasCompressed&&!M){const ye=Y.headerSizeBytes+Y.chunkElement.storageSizeBytes;E=Zl(ne,E),E.byteLength>=ye&&(In.readElementData(Y.chunkElement,E,Y.headerSizeBytes),D=ye,z=ye,M=!0)}}else if(H+=Be.decode(re),xt.checkTextForEndHeader(H)){if(x=xt.determineHeaderFormatFromHeaderText(H),x===Ut.INRIAV1)Y=Dn.decodeHeaderText(H),l=Math.min(l,Y.sphericalHarmonicsDegree),_=Y.splatCount,M=!0,G=Y.headerSizeBytes+Y.bytesPerSplat*_;else if(x===Ut.PlayCanvasCompressed){if(Y=In.decodeHeaderText(H),l=Math.min(l,Y.sphericalHarmonicsDegree),g===ct.ProgressiveToSplatBuffer&&l>0)throw new fr("PlyLoader.loadFromURL() -> Selected PLY format has spherical harmonics data that cannot be progressively loaded.");_=Y.vertexElement.count,G=Y.headerSizeBytes+Y.bytesPerSplat*_+Y.chunkElement.storageSizeBytes}else{if(g===ct.ProgressiveToSplatBuffer)throw new fr("PlyLoader.loadFromURL() -> Selected PLY format cannot be progressively loaded.");g=ct.DownloadBeforeProcessing;return}if(g===ct.ProgressiveToSplatBuffer){const ye=_e.CompressionLevels[0].SphericalHarmonicsDegrees[l],Ae=f+ye.BytesPerSplat*_;y=new ArrayBuffer(Ae),_e.writeHeaderToBuffer({versionMajor:_e.CurrentMajorVersion,versionMinor:_e.CurrentMinorVersion,maxSectionCount:m,sectionCount:m,maxSplatCount:_,splatCount:0,compressionLevel:0,sceneCenter:new I},y)}else le=new de(l);D=Y.headerSizeBytes,z=Y.headerSizeBytes,S=!0}if(S&&M&&ne.length>0&&(v=Zl(ne,v),U-D>A||U>=G&&!F||ae)){const Ae=F?Y.sphericalHarmonicsPerSplat:Y.bytesPerSplat,He=(F?U:Math.min(G,U))-z,Oe=Math.floor(He/Ae),L=Oe*Ae,Ke=U-z-L,Ce=z-ne[0].startBytes,Ge=new DataView(v,Ce,L);if(F)x===Ut.PlayCanvasCompressed&&g===ct.ProgressiveToSplatArray&&(In.parseSphericalHarmonicsToUncompressedSplatArraySection(Y.chunkElement,Y.shElement,O,O+Oe-1,Ge,0,l,Y.sphericalHarmonicsDegree,le),O+=Oe);else{if(g===ct.ProgressiveToSplatBuffer){const Pe=_e.CompressionLevels[0].SphericalHarmonicsDegrees[l],We=w*Pe.BytesPerSplat+f;x===Ut.PlayCanvasCompressed?In.parseToUncompressedSplatBufferSection(Y.chunkElement,Y.vertexElement,0,Oe-1,w,Ge,y,We):Dn.parseToUncompressedSplatBufferSection(Y,0,Oe-1,Ge,0,y,We,l)}else x===Ut.PlayCanvasCompressed?In.parseToUncompressedSplatArraySection(Y.chunkElement,Y.vertexElement,0,Oe-1,w,Ge,le):Dn.parseToUncompressedSplatArraySection(Y,0,Oe-1,Ge,0,le,l);w+=Oe,g===ct.ProgressiveToSplatBuffer&&(T||(_e.writeSectionHeaderToBuffer({maxSplatCount:_,splatCount:w,bucketSize:0,bucketCount:0,bucketBlockSize:0,compressionScaleRange:0,storageSizeBytes:0,fullBucketCount:0,partiallyFilledBucketCount:0,sphericalHarmonicsDegree:l},0,y,_e.HeaderSizeBytes),T=new _e(y,!1)),T.updateLoadedCounts(1,w)),U>=G&&(F=!0)}if(Ke===0)ne=[];else{let Pe=[],We=0;for(let be=ne.length-1;be>=0;be--){const R=ne[be];if(We+=R.sizeBytes,Pe.unshift(R),We>=Ke)break}ne=Pe}D+=A,z+=L}i&&T&&i(T,ae),ae&&(g===ct.ProgressiveToSplatBuffer?P.resolve(T):P.resolve(le))}t&&t(X,$,vt.Downloading)};return t&&t(0,"0%",vt.Downloading),Cr(e,Re,!1,c).then(()=>(t&&t(0,"0%",vt.Processing),P.promise.then(X=>{if(t&&t(100,"100%",vt.Done),g===ct.DownloadBeforeProcessing){const $=ne.map(re=>re.data);return new Blob($).arrayBuffer().then(re=>Ro.loadFromFileData(re,r,a,o,l,u,d,p,h))}else return g===ct.ProgressiveToSplatBuffer?X:Yt(()=>$l(X,o,r,a,u,d,p,h))})))}static loadFromFileData(e,t,n,i,r=0,a,o,l,c){return i?Yt(()=>jl.parseToUncompressedSplatArray(e,r)).then(u=>$l(u,i,t,n,a,o,l,c)):Yt(()=>jl.parseToUncompressedSplatBuffer(e,r))}}const A0=s=>new ReadableStream({async start(e){e.enqueue(s),e.close()}});async function S0(s){try{const e=A0(s);if(!e)throw new Error("Failed to create stream from data");return await x0(e)}catch(e){throw console.error("Error decompressing gzipped data:",e),e}}async function x0(s){const e=s.pipeThrough(new DecompressionStream("gzip")),n=await new Response(e).arrayBuffer();return new Uint8Array(n)}const v0=1347635022,_0=1,y0=.15;function M0(s){const e=s>>15&1,t=s>>10&31,n=s&1023,i=e===1?-1:1;return t===0?i*Math.pow(2,-14)*n/1024:t===31?n!==0?NaN:i*(1/0):i*Math.pow(2,t-15)*(1+n/1024)}function C0(s){return(s-128)/128}function ui(s){switch(s){case 0:return 0;case 1:return 3;case 2:return 8;case 3:return 15;default:return console.error(`[SPZ: ERROR] Unsupported SH degree: ${s}`),0}}const E0=function(){let s=[];const e=new ut,t=de.OFFSET.X,n=de.OFFSET.Y,i=de.OFFSET.Z,r=de.OFFSET.SCALE0,a=de.OFFSET.SCALE1,o=de.OFFSET.SCALE2,l=de.OFFSET.ROTATION0,c=de.OFFSET.ROTATION1,u=de.OFFSET.ROTATION2,d=de.OFFSET.ROTATION3,p=de.OFFSET.FDC0,h=de.OFFSET.FDC1,g=de.OFFSET.FDC2,A=de.OFFSET.OPACITY,f=[ui(0),ui(1),ui(2),ui(3)],m=[0,1,2,9,10,11,12,13,24,25,26,27,28,29,30,3,4,5,14,15,16,17,18,31,32,33,34,35,36,37,6,7,8,19,20,21,22,23,38,39,40,41,42,43,44];return function(x,v,y){y=Math.min(v,y);const T=de.createSplat(y);x.scale[0]!==void 0?(T[r]=x.scale[0],T[a]=x.scale[1],T[o]=x.scale[2]):(T[r]=.01,T[a]=.01,T[o]=.01),x.color[0]!==void 0?(T[p]=x.color[0],T[h]=x.color[1],T[g]=x.color[2]):s[RED]!==void 0?(T[p]=s[RED]*255,T[h]=s[GREEN]*255,T[g]=s[BLUE]*255):(T[p]=0,T[h]=0,T[g]=0),x.alpha!==void 0&&(T[A]=x.alpha),T[p]=ht(Math.floor(T[p]),0,255),T[h]=ht(Math.floor(T[h]),0,255),T[g]=ht(Math.floor(T[g]),0,255),T[A]=ht(Math.floor(T[A]),0,255);let E=f[y],_=f[v];for(let w=0;w<3;++w)for(let O=0;O<15;++O){const S=m[w*15+O];O<E&&O<_&&(T[de.OFFSET.FRC0+S]=x.sh[w*_+O])}return e.set(x.rotation[3],x.rotation[0],x.rotation[1],x.rotation[2]),e.normalize(),T[l]=e.x,T[c]=e.y,T[u]=e.z,T[d]=e.w,T[t]=x.position[0],T[n]=x.position[1],T[i]=x.position[2],T}}();function T0(s,e,t,n){return!(s.positions.length!==e*3*(n?2:3)||s.scales.length!==e*3||s.rotations.length!==e*3||s.alphas.length!==e||s.colors.length!==e*3||s.sh.length!==e*t*3)}function Jl(s,e,t,n,i){e=Math.min(e,s.shDegree);const r=s.numPoints,a=ui(s.shDegree),o=s.positions.length===r*3*2;if(!T0(s,r,a,o))return null;const l={position:[],scale:[],rotation:[],alpha:void 0,color:[],sh:[]};let c;o&&(c=new Uint16Array(s.positions.buffer,s.positions.byteOffset,r*3));const u=1/(1<<s.fractionalBits),d=ui(s.shDegree),p=.28209479177387814;for(let h=0;h<r;h++){if(o)for(let x=0;x<3;x++)l.position[x]=M0(c[h*3+x]);else for(let x=0;x<3;x++){const v=h*9+x*3;let y=s.positions[v];y|=s.positions[v+1]<<8,y|=s.positions[v+2]<<16,y|=y&8388608?4278190080:0,l.position[x]=y*u}for(let x=0;x<3;x++)l.scale[x]=Math.exp(s.scales[h*3+x]/16-10);const g=s.rotations.subarray(h*3,h*3+3),A=[g[0]/127.5-1,g[1]/127.5-1,g[2]/127.5-1];l.rotation[0]=A[0],l.rotation[1]=A[1],l.rotation[2]=A[2];const f=A[0]*A[0]+A[1]*A[1]+A[2]*A[2];l.rotation[3]=Math.sqrt(Math.max(0,1-f)),l.alpha=Math.floor(s.alphas[h]);for(let x=0;x<3;x++)l.color[x]=Math.floor(((s.colors[h*3+x]/255-.5)/y0*p+.5)*255);for(let x=0;x<3;x++)for(let v=0;v<d;v++)l.sh[x*d+v]=C0(s.sh[d*3*h+v*3+x]);const m=E0(l,s.shDegree,e);if(t){const x=_e.CompressionLevels[0].SphericalHarmonicsDegrees[e].BytesPerSplat,v=h*x+i;_e.writeSplatDataToSectionBuffer(m,n,v,0,e)}else n.addSplat(m)}}const b0=16,w0=1e7;function R0(s){const e=new DataView(s);let t=0;const n={magic:e.getUint32(t,!0),version:e.getUint32(t+4,!0),numPoints:e.getUint32(t+8,!0),shDegree:e.getUint8(t+12),fractionalBits:e.getUint8(t+13),flags:e.getUint8(t+14),reserved:e.getUint8(t+15)};if(t+=b0,n.magic!==v0)return console.error("[SPZ ERROR] deserializePackedGaussians: header not found"),null;if(n.version<1||n.version>2)return console.error(`[SPZ ERROR] deserializePackedGaussians: version not supported: ${n.version}`),null;if(n.numPoints>w0)return console.error(`[SPZ ERROR] deserializePackedGaussians: Too many points: ${n.numPoints}`),null;if(n.shDegree>3)return console.error(`[SPZ ERROR] deserializePackedGaussians: Unsupported SH degree: ${n.shDegree}`),null;const i=n.numPoints,r=ui(n.shDegree),a=n.version===1,o={numPoints:i,shDegree:n.shDegree,fractionalBits:n.fractionalBits,antialiased:(n.flags&_0)!==0,positions:new Uint8Array(i*3*(a?2:3)),scales:new Uint8Array(i*3),rotations:new Uint8Array(i*3),alphas:new Uint8Array(i),colors:new Uint8Array(i*3),sh:new Uint8Array(i*r*3)};try{const l=new Uint8Array(s);let c=o.positions.length,u=t;if(o.positions.set(l.slice(u,u+c)),u+=c,o.alphas.set(l.slice(u,u+o.alphas.length)),u+=o.alphas.length,o.colors.set(l.slice(u,u+o.colors.length)),u+=o.colors.length,o.scales.set(l.slice(u,u+o.scales.length)),u+=o.scales.length,o.rotations.set(l.slice(u,u+o.rotations.length)),u+=o.rotations.length,o.sh.set(l.slice(u,u+o.sh.length)),u+o.sh.length!==s.byteLength)return console.error("[SPZ ERROR] deserializePackedGaussians: incorrect buffer size"),null}catch(l){return console.error("[SPZ ERROR] deserializePackedGaussians: read error",l),null}return o}async function I0(s){try{const e=await S0(s);return R0(e.buffer)}catch(e){return console.error("[SPZ ERROR] loadSpzPacked: decompression error",e),null}}class Io{static loadFromURL(e,t,n,i,r=!0,a=0,o,l,c,u,d){return t&&t(0,"0%",vt.Downloading),Cr(e,t,!0,o).then(p=>(t&&t(0,"0%",vt.Processing),Io.loadFromFileData(p,n,i,r,a,l,c,u,d)))}static async loadFromFileData(e,t,n,i,r=0,a,o,l,c){await Yt();const u=await I0(e);r=Math.min(u.shDegree,r);const d=new de(r);if(i)return Jl(u,r,!1,d,0),_s.getStandardGenerator(t,n,a,o,l,c).generateFromUncompressedSplatArray(d);{const{splatBuffer:p,splatBufferDataOffsetBytes:h}=_e.preallocateUncompressed(u.numPoints,r);return Jl(u,r,!0,p.bufferData,h),p}}}const st=class st{static parseToUncompressedSplatBufferSection(e,t,n,i,r,a){const o=_e.CompressionLevels[0].BytesPerCenter,l=_e.CompressionLevels[0].BytesPerScale,c=_e.CompressionLevels[0].BytesPerRotation,u=_e.CompressionLevels[0].SphericalHarmonicsDegrees[0].BytesPerSplat;for(let d=e;d<=t;d++){const p=d*st.RowSizeBytes+i,h=new Float32Array(n,p,3),g=new Float32Array(n,p+st.CenterSizeBytes,3),A=new Uint8Array(n,p+st.CenterSizeBytes+st.ScaleSizeBytes,4),f=new Uint8Array(n,p+st.CenterSizeBytes+st.ScaleSizeBytes+st.RotationSizeBytes,4),m=new ut((f[1]-128)/128,(f[2]-128)/128,(f[3]-128)/128,(f[0]-128)/128);m.normalize();const x=d*u+a,v=new Float32Array(r,x,3),y=new Float32Array(r,x+o,3),T=new Float32Array(r,x+o+l,4),E=new Uint8Array(r,x+o+l+c,4);v[0]=h[0],v[1]=h[1],v[2]=h[2],y[0]=g[0],y[1]=g[1],y[2]=g[2],T[0]=m.w,T[1]=m.x,T[2]=m.y,T[3]=m.z,E[0]=A[0],E[1]=A[1],E[2]=A[2],E[3]=A[3]}}static parseToUncompressedSplatArraySection(e,t,n,i,r){for(let a=e;a<=t;a++){const o=a*st.RowSizeBytes+i,l=new Float32Array(n,o,3),c=new Float32Array(n,o+st.CenterSizeBytes,3),u=new Uint8Array(n,o+st.CenterSizeBytes+st.ScaleSizeBytes,4),d=new Uint8Array(n,o+st.CenterSizeBytes+st.ScaleSizeBytes+st.RotationSizeBytes,4),p=new ut((d[1]-128)/128,(d[2]-128)/128,(d[3]-128)/128,(d[0]-128)/128);p.normalize(),r.addSplatFromComonents(l[0],l[1],l[2],c[0],c[1],c[2],p.w,p.x,p.y,p.z,u[0],u[1],u[2],u[3])}}static parseStandardSplatToUncompressedSplatArray(e){const t=e.byteLength/st.RowSizeBytes,n=new de;for(let i=0;i<t;i++){const r=i*st.RowSizeBytes,a=new Float32Array(e,r,3),o=new Float32Array(e,r+st.CenterSizeBytes,3),l=new Uint8Array(e,r+st.CenterSizeBytes+st.ScaleSizeBytes,4),c=new Uint8Array(e,r+st.CenterSizeBytes+st.ScaleSizeBytes+st.ColorSizeBytes,4),u=new ut((c[1]-128)/128,(c[2]-128)/128,(c[3]-128)/128,(c[0]-128)/128);u.normalize(),n.addSplatFromComonents(a[0],a[1],a[2],o[0],o[1],o[2],u.w,u.x,u.y,u.z,l[0],l[1],l[2],l[3])}return n}};Z(st,"RowSizeBytes",32),Z(st,"CenterSizeBytes",12),Z(st,"ScaleSizeBytes",12),Z(st,"RotationSizeBytes",4),Z(st,"ColorSizeBytes",4);let ai=st;function ec(s,e,t,n,i,r,a,o){return e?_s.getStandardGenerator(t,n,i,r,a,o).generateFromUncompressedSplatArray(s):_e.generateFromUncompressedSplatArrays([s],t,0,new I)}class Po{static loadFromURL(e,t,n,i,r,a,o=!0,l,c,u,d,p){let h=n?ct.ProgressiveToSplatBuffer:ct.ProgressiveToSplatArray;o&&(h=ct.ProgressiveToSplatArray);const g=_e.HeaderSizeBytes+_e.SectionHeaderSizeBytes,A=Qe.ProgressiveLoadSectionSize,f=1;let m,x,v,y=0,T=0,E;const _=So();let w=0,O=0,S=[];const M=(F,P,D,z)=>{const U=F>=100;if(D&&S.push(D),h===ct.DownloadBeforeProcessing){U&&_.resolve(S);return}if(!z){if(n)throw new fr("Cannon directly load .splat because no file size info is available.");h=ct.DownloadBeforeProcessing;return}if(!m){y=z/ai.RowSizeBytes,m=new ArrayBuffer(z);const G=_e.CompressionLevels[0].SphericalHarmonicsDegrees[0].BytesPerSplat,H=g+G*y;h===ct.ProgressiveToSplatBuffer?(x=new ArrayBuffer(H),_e.writeHeaderToBuffer({versionMajor:_e.CurrentMajorVersion,versionMinor:_e.CurrentMinorVersion,maxSectionCount:f,sectionCount:f,maxSplatCount:y,splatCount:T,compressionLevel:0,sceneCenter:new I},x)):E=new de(0)}if(D){new Uint8Array(m,O,D.byteLength).set(new Uint8Array(D)),O+=D.byteLength;const G=O-w;if(G>A||U){const Y=(U?G:A)/ai.RowSizeBytes,ne=T+Y;h===ct.ProgressiveToSplatBuffer?ai.parseToUncompressedSplatBufferSection(T,ne-1,m,0,x,g):ai.parseToUncompressedSplatArraySection(T,ne-1,m,0,E),T=ne,h===ct.ProgressiveToSplatBuffer&&(v||(_e.writeSectionHeaderToBuffer({maxSplatCount:y,splatCount:T,bucketSize:0,bucketCount:0,bucketBlockSize:0,compressionScaleRange:0,storageSizeBytes:0,fullBucketCount:0,partiallyFilledBucketCount:0},0,x,_e.HeaderSizeBytes),v=new _e(x,!1)),v.updateLoadedCounts(1,T),i&&i(v,U)),w+=A}}U&&(h===ct.ProgressiveToSplatBuffer?_.resolve(v):_.resolve(E)),t&&t(F,P,vt.Downloading)};return t&&t(0,"0%",vt.Downloading),Cr(e,M,!1,l).then(()=>(t&&t(0,"0%",vt.Processing),_.promise.then(F=>(t&&t(100,"100%",vt.Done),h===ct.DownloadBeforeProcessing?new Blob(S).arrayBuffer().then(P=>Po.loadFromFileData(P,r,a,o,c,u,d,p)):h===ct.ProgressiveToSplatBuffer?F:Yt(()=>ec(F,o,r,a,c,u,d,p))))))}static loadFromFileData(e,t,n,i,r,a,o,l){return Yt(()=>{const c=ai.parseStandardSplatToUncompressedSplatArray(e);return ec(c,i,t,n,r,a,o,l)})}}const Oi=class Oi{static checkVersion(e){const t=_e.CurrentMajorVersion,n=_e.CurrentMinorVersion,i=_e.parseHeader(e);if(i.versionMajor===t&&i.versionMinor>=n||i.versionMajor>t)return!0;throw new Error(`KSplat version not supported: v${i.versionMajor}.${i.versionMinor}. Minimum required: v${t}.${n}`)}static loadFromURL(e,t,n,i,r){let a,o,l,c,u=!1,d=!1,p,h=[],g=!1,A=!1,f=0,m=0,x=0,v=!1,y=!1,T=!1,E=[];const _=So(),w=()=>{!u&&!d&&f>=_e.HeaderSizeBytes&&(d=!0,new Blob(E).arrayBuffer().then(z=>{l=new ArrayBuffer(_e.HeaderSizeBytes),new Uint8Array(l).set(new Uint8Array(z,0,_e.HeaderSizeBytes)),Oi.checkVersion(l),d=!1,u=!0,c=_e.parseHeader(l),window.setTimeout(()=>{M()},1)}))};let O=0;const S=()=>{O===0&&(O++,window.setTimeout(()=>{O--,F()},1))},M=()=>{const D=()=>{A=!0,new Blob(E).arrayBuffer().then(U=>{A=!1,g=!0,p=new ArrayBuffer(c.maxSectionCount*_e.SectionHeaderSizeBytes),new Uint8Array(p).set(new Uint8Array(U,_e.HeaderSizeBytes,c.maxSectionCount*_e.SectionHeaderSizeBytes)),h=_e.parseSectionHeaders(c,p,0,!1);let G=0;for(let Y=0;Y<c.maxSectionCount;Y++)G+=h[Y].storageSizeBytes;const H=_e.HeaderSizeBytes+c.maxSectionCount*_e.SectionHeaderSizeBytes+G;if(!a){a=new ArrayBuffer(H);let Y=0;for(let ne=0;ne<E.length;ne++){const le=E[ne];new Uint8Array(a,Y,le.byteLength).set(new Uint8Array(le)),Y+=le.byteLength}}x=_e.HeaderSizeBytes+_e.SectionHeaderSizeBytes*c.maxSectionCount;for(let Y=0;Y<=h.length&&Y<c.maxSectionCount;Y++)x+=h[Y].storageSizeBytes;S()})};!A&&!g&&u&&f>=_e.HeaderSizeBytes+_e.SectionHeaderSizeBytes*c.maxSectionCount&&D()},F=()=>{if(T)return;T=!0;const D=()=>{if(T=!1,g){if(y)return;if(v=f>=x,f-m>Qe.ProgressiveLoadSectionSize||v){m+=Qe.ProgressiveLoadSectionSize,y=m>=x,o||(o=new _e(a,!1));const U=_e.HeaderSizeBytes+_e.SectionHeaderSizeBytes*c.maxSectionCount;let G=0,H=0,Y=0;for(let Be=0;Be<c.maxSectionCount;Be++){const Re=h[Be],X=G+Re.partiallyFilledBucketCount*4+Re.bucketStorageSizeBytes*Re.bucketCount,$=U+X;if(m>=$){H++;const re=m-$,Ae=_e.CompressionLevels[c.compressionLevel].SphericalHarmonicsDegrees[Re.sphericalHarmonicsDegree].BytesPerSplat;let Ie=Math.floor(re/Ae);Ie=Math.min(Ie,Re.maxSplatCount),Y+=Ie,o.updateLoadedCounts(H,Y),o.updateSectionLoadedCounts(Be,Ie)}else break;G+=Re.storageSizeBytes}i(o,y);const ne=m/x*100,le=ne.toFixed(2)+"%";t&&t(ne,le,vt.Downloading),y?_.resolve(o):F()}}};window.setTimeout(D,Qe.ProgressiveLoadSectionDelayDuration)};return Cr(e,(D,z,U)=>{U&&(E.push(U),a&&new Uint8Array(a,f,U.byteLength).set(new Uint8Array(U)),f+=U.byteLength),n?(w(),M(),F()):t&&t(D,z,vt.Downloading)},!n,r).then(D=>(t&&t(0,"0%",vt.Processing),(n?_.promise:Oi.loadFromFileData(D)).then(U=>(t&&t(100,"100%",vt.Done),U))))}static loadFromFileData(e){return Yt(()=>(Oi.checkVersion(e),new _e(e)))}};Z(Oi,"downloadFile",function(){let e;return function(t,n){const i=new Blob([t.bufferData],{type:"application/octet-stream"});e||(e=document.createElement("a"),document.body.appendChild(e)),e.download=n,e.href=URL.createObjectURL(i),e.click()}}());let to=Oi;const It={Splat:0,KSplat:1,Ply:2,Spz:3},tc=s=>s.endsWith(".ply")?It.Ply:s.endsWith(".splat")?It.Splat:s.endsWith(".ksplat")?It.KSplat:s.endsWith(".spz")?It.Spz:null,nc={type:"change"},ca={type:"start"},ic={type:"end"},js=new Ic,sc=new Vn,P0=Math.cos(70*fo.DEG2RAD);class Zs extends fi{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"KeyA",UP:"KeyW",RIGHT:"KeyD",BOTTOM:"KeyS"},this.mouseButtons={LEFT:mi.ROTATE,MIDDLE:mi.DOLLY,RIGHT:mi.PAN},this.touches={ONE:gi.ROTATE,TWO:gi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(B){B.addEventListener("keydown",se),this._domElementKeyEvents=B},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",se),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,this.clearDampedRotation(),this.clearDampedPan(),n.object.updateProjectionMatrix(),n.dispatchEvent(nc),n.update(),r=i.NONE},this.clearDampedRotation=function(){l.theta=0,l.phi=0},this.clearDampedPan=function(){u.set(0,0,0)},this.update=function(){const B=new I,ie=new ut().setFromUnitVectors(e.up,new I(0,1,0)),ce=ie.clone().invert(),Ue=new I,De=new ut,je=new I,N=2*Math.PI;return function(){ie.setFromUnitVectors(e.up,new I(0,1,0)),ce.copy(ie).invert();const K=n.object.position;B.copy(K).sub(n.target),B.applyQuaternion(ie),o.setFromVector3(B),n.autoRotate&&r===i.NONE&&M(O()),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let J=n.minAzimuthAngle,he=n.maxAzimuthAngle;isFinite(J)&&isFinite(he)&&(J<-Math.PI?J+=N:J>Math.PI&&(J-=N),he<-Math.PI?he+=N:he>Math.PI&&(he-=N),J<=he?o.theta=Math.max(J,Math.min(he,o.theta)):o.theta=o.theta>(J+he)/2?Math.max(J,o.theta):Math.min(he,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.zoomToCursor&&E||n.object.isOrthographicCamera?o.radius=Y(o.radius):o.radius=Y(o.radius*c),B.setFromSpherical(o),B.applyQuaternion(ce),K.copy(n.target).add(B),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),u.set(0,0,0));let me=!1;if(n.zoomToCursor&&E){let qe=null;if(n.object.isPerspectiveCamera){const at=B.length();qe=Y(at*c);const yt=at-qe;n.object.position.addScaledVector(y,yt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const at=new I(T.x,T.y,0);at.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),me=!0;const yt=new I(T.x,T.y,0);yt.unproject(n.object),n.object.position.sub(yt).add(at),n.object.updateMatrixWorld(),qe=B.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;qe!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(qe).add(n.object.position):(js.origin.copy(n.object.position),js.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(js.direction))<P0?e.lookAt(n.target):(sc.setFromNormalAndCoplanarPoint(n.object.up,n.target),js.intersectPlane(sc,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),me=!0);return c=1,E=!1,me||Ue.distanceToSquared(n.object.position)>a||8*(1-De.dot(n.object.quaternion))>a||je.distanceToSquared(n.target)>0?(n.dispatchEvent(nc),Ue.copy(n.object.position),De.copy(n.object.quaternion),je.copy(n.target),me=!1,!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",fe),n.domElement.removeEventListener("pointerdown",We),n.domElement.removeEventListener("pointercancel",R),n.domElement.removeEventListener("wheel",ee),n.domElement.removeEventListener("pointermove",be),n.domElement.removeEventListener("pointerup",R),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",se),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const a=1e-6,o=new Ul,l=new Ul;let c=1;const u=new I,d=new Me,p=new Me,h=new Me,g=new Me,A=new Me,f=new Me,m=new Me,x=new Me,v=new Me,y=new I,T=new Me;let E=!1;const _=[],w={};function O(){return 2*Math.PI/60/60*n.autoRotateSpeed}function S(){return Math.pow(.95,n.zoomSpeed)}function M(B){l.theta-=B}function F(B){l.phi-=B}const P=function(){const B=new I;return function(ce,Ue){B.setFromMatrixColumn(Ue,0),B.multiplyScalar(-ce),u.add(B)}}(),D=function(){const B=new I;return function(ce,Ue){n.screenSpacePanning===!0?B.setFromMatrixColumn(Ue,1):(B.setFromMatrixColumn(Ue,0),B.crossVectors(n.object.up,B)),B.multiplyScalar(ce),u.add(B)}}(),z=function(){const B=new I;return function(ce,Ue){const De=n.domElement;if(n.object.isPerspectiveCamera){const je=n.object.position;B.copy(je).sub(n.target);let N=B.length();N*=Math.tan(n.object.fov/2*Math.PI/180),P(2*ce*N/De.clientHeight,n.object.matrix),D(2*Ue*N/De.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(P(ce*(n.object.right-n.object.left)/n.object.zoom/De.clientWidth,n.object.matrix),D(Ue*(n.object.top-n.object.bottom)/n.object.zoom/De.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function U(B){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function G(B){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function H(B){if(!n.zoomToCursor)return;E=!0;const ie=n.domElement.getBoundingClientRect(),ce=B.clientX-ie.left,Ue=B.clientY-ie.top,De=ie.width,je=ie.height;T.x=ce/De*2-1,T.y=-(Ue/je)*2+1,y.set(T.x,T.y,1).unproject(e).sub(e.position).normalize()}function Y(B){return Math.max(n.minDistance,Math.min(n.maxDistance,B))}function ne(B){d.set(B.clientX,B.clientY)}function le(B){H(B),m.set(B.clientX,B.clientY)}function Be(B){g.set(B.clientX,B.clientY)}function Re(B){p.set(B.clientX,B.clientY),h.subVectors(p,d).multiplyScalar(n.rotateSpeed);const ie=n.domElement;M(2*Math.PI*h.x/ie.clientHeight),F(2*Math.PI*h.y/ie.clientHeight),d.copy(p),n.update()}function X(B){x.set(B.clientX,B.clientY),v.subVectors(x,m),v.y>0?U(S()):v.y<0&&G(S()),m.copy(x),n.update()}function $(B){A.set(B.clientX,B.clientY),f.subVectors(A,g).multiplyScalar(n.panSpeed),z(f.x,f.y),g.copy(A),n.update()}function re(B){H(B),B.deltaY<0?G(S()):B.deltaY>0&&U(S()),n.update()}function ae(B){let ie=!1;switch(B.code){case n.keys.UP:B.ctrlKey||B.metaKey||B.shiftKey?F(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(0,n.keyPanSpeed),ie=!0;break;case n.keys.BOTTOM:B.ctrlKey||B.metaKey||B.shiftKey?F(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(0,-n.keyPanSpeed),ie=!0;break;case n.keys.LEFT:B.ctrlKey||B.metaKey||B.shiftKey?M(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(n.keyPanSpeed,0),ie=!0;break;case n.keys.RIGHT:B.ctrlKey||B.metaKey||B.shiftKey?M(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):z(-n.keyPanSpeed,0),ie=!0;break}ie&&(B.preventDefault(),n.update())}function ye(){if(_.length===1)d.set(_[0].pageX,_[0].pageY);else{const B=.5*(_[0].pageX+_[1].pageX),ie=.5*(_[0].pageY+_[1].pageY);d.set(B,ie)}}function Ae(){if(_.length===1)g.set(_[0].pageX,_[0].pageY);else{const B=.5*(_[0].pageX+_[1].pageX),ie=.5*(_[0].pageY+_[1].pageY);g.set(B,ie)}}function Ie(){const B=_[0].pageX-_[1].pageX,ie=_[0].pageY-_[1].pageY,ce=Math.sqrt(B*B+ie*ie);m.set(0,ce)}function He(){n.enableZoom&&Ie(),n.enablePan&&Ae()}function Oe(){n.enableZoom&&Ie(),n.enableRotate&&ye()}function L(B){if(_.length==1)p.set(B.pageX,B.pageY);else{const ce=xe(B),Ue=.5*(B.pageX+ce.x),De=.5*(B.pageY+ce.y);p.set(Ue,De)}h.subVectors(p,d).multiplyScalar(n.rotateSpeed);const ie=n.domElement;M(2*Math.PI*h.x/ie.clientHeight),F(2*Math.PI*h.y/ie.clientHeight),d.copy(p)}function Ke(B){if(_.length===1)A.set(B.pageX,B.pageY);else{const ie=xe(B),ce=.5*(B.pageX+ie.x),Ue=.5*(B.pageY+ie.y);A.set(ce,Ue)}f.subVectors(A,g).multiplyScalar(n.panSpeed),z(f.x,f.y),g.copy(A)}function Ce(B){const ie=xe(B),ce=B.pageX-ie.x,Ue=B.pageY-ie.y,De=Math.sqrt(ce*ce+Ue*Ue);x.set(0,De),v.set(0,Math.pow(x.y/m.y,n.zoomSpeed)),U(v.y),m.copy(x)}function Ge(B){n.enableZoom&&Ce(B),n.enablePan&&Ke(B)}function Pe(B){n.enableZoom&&Ce(B),n.enableRotate&&L(B)}function We(B){n.enabled!==!1&&(_.length===0&&(n.domElement.setPointerCapture(B.pointerId),n.domElement.addEventListener("pointermove",be),n.domElement.addEventListener("pointerup",R)),ve(B),B.pointerType==="touch"?te(B):C(B))}function be(B){n.enabled!==!1&&(B.pointerType==="touch"?we(B):W(B))}function R(B){Ye(B),_.length===0&&(n.domElement.releasePointerCapture(B.pointerId),n.domElement.removeEventListener("pointermove",be),n.domElement.removeEventListener("pointerup",R)),n.dispatchEvent(ic),r=i.NONE}function C(B){let ie;switch(B.button){case 0:ie=n.mouseButtons.LEFT;break;case 1:ie=n.mouseButtons.MIDDLE;break;case 2:ie=n.mouseButtons.RIGHT;break;default:ie=-1}switch(ie){case mi.DOLLY:if(n.enableZoom===!1)return;le(B),r=i.DOLLY;break;case mi.ROTATE:if(B.ctrlKey||B.metaKey||B.shiftKey){if(n.enablePan===!1)return;Be(B),r=i.PAN}else{if(n.enableRotate===!1)return;ne(B),r=i.ROTATE}break;case mi.PAN:if(B.ctrlKey||B.metaKey||B.shiftKey){if(n.enableRotate===!1)return;ne(B),r=i.ROTATE}else{if(n.enablePan===!1)return;Be(B),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(ca)}function W(B){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;Re(B);break;case i.DOLLY:if(n.enableZoom===!1)return;X(B);break;case i.PAN:if(n.enablePan===!1)return;$(B);break}}function ee(B){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(B.preventDefault(),n.dispatchEvent(ca),re(B),n.dispatchEvent(ic))}function se(B){n.enabled===!1||n.enablePan===!1||ae(B)}function te(B){switch(oe(B),_.length){case 1:switch(n.touches.ONE){case gi.ROTATE:if(n.enableRotate===!1)return;ye(),r=i.TOUCH_ROTATE;break;case gi.PAN:if(n.enablePan===!1)return;Ae(),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case gi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;He(),r=i.TOUCH_DOLLY_PAN;break;case gi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Oe(),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(ca)}function we(B){switch(oe(B),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;L(B),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;Ke(B),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Ge(B),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Pe(B),n.update();break;default:r=i.NONE}}function fe(B){n.enabled!==!1&&B.preventDefault()}function ve(B){_.push(B)}function Ye(B){delete w[B.pointerId];for(let ie=0;ie<_.length;ie++)if(_[ie].pointerId==B.pointerId){_.splice(ie,1);return}}function oe(B){let ie=w[B.pointerId];ie===void 0&&(ie=new Me,w[B.pointerId]=ie),ie.set(B.pageX,B.pageY)}function xe(B){const ie=B.pointerId===_[0].pointerId?_[1]:_[0];return w[ie.pointerId]}n.domElement.addEventListener("contextmenu",fe),n.domElement.addEventListener("pointerdown",We),n.domElement.addEventListener("pointercancel",R),n.domElement.addEventListener("wheel",ee,{passive:!1}),this.update()}}const D0=(s,e,t,n,i)=>{const r=performance.now();let a=s.style.display==="none"?0:parseFloat(s.style.opacity);isNaN(a)&&(a=1);const o=window.setInterval(()=>{const c=performance.now()-r;let u=Math.min(c/n,1);u>.999&&(u=1);let d;e?(d=(1-u)*a,d<1e-4&&(d=0)):d=(1-a)*u+a,d>0?(s.style.display=t,s.style.opacity=d):s.style.display="none",u>=1&&(i&&i(),window.clearInterval(o))},16);return o},F0=500,gr=class gr{constructor(e,t){this.taskIDGen=0,this.elementID=gr.elementIDGen++,this.tasks=[],this.message=e||"Loading...",this.container=t||document.body,this.spinnerContainerOuter=document.createElement("div"),this.spinnerContainerOuter.className=`spinnerOuterContainer${this.elementID}`,this.spinnerContainerOuter.style.display="none",this.spinnerContainerPrimary=document.createElement("div"),this.spinnerContainerPrimary.className=`spinnerContainerPrimary${this.elementID}`,this.spinnerPrimary=document.createElement("div"),this.spinnerPrimary.classList.add(`spinner${this.elementID}`,`spinnerPrimary${this.elementID}`),this.messageContainerPrimary=document.createElement("div"),this.messageContainerPrimary.classList.add(`messageContainer${this.elementID}`,`messageContainerPrimary${this.elementID}`),this.messageContainerPrimary.innerHTML=this.message,this.spinnerContainerMin=document.createElement("div"),this.spinnerContainerMin.className=`spinnerContainerMin${this.elementID}`,this.spinnerMin=document.createElement("div"),this.spinnerMin.classList.add(`spinner${this.elementID}`,`spinnerMin${this.elementID}`),this.messageContainerMin=document.createElement("div"),this.messageContainerMin.classList.add(`messageContainer${this.elementID}`,`messageContainerMin${this.elementID}`),this.messageContainerMin.innerHTML=this.message,this.spinnerContainerPrimary.appendChild(this.spinnerPrimary),this.spinnerContainerPrimary.appendChild(this.messageContainerPrimary),this.spinnerContainerOuter.appendChild(this.spinnerContainerPrimary),this.spinnerContainerMin.appendChild(this.spinnerMin),this.spinnerContainerMin.appendChild(this.messageContainerMin),this.spinnerContainerOuter.appendChild(this.spinnerContainerMin);const n=document.createElement("style");n.innerHTML=`

            .spinnerOuterContainer${this.elementID} {
                width: 100%;
                height: 100%;
                margin: 0;
                top: 0;
                left: 0;
                position: absolute;
                pointer-events: none;
            }

            .messageContainer${this.elementID} {
                height: 20px;
                font-family: arial;
                font-size: 12pt;
                color: #ffffff;
                text-align: center;
                vertical-align: middle;
            }

            .spinner${this.elementID} {
                padding: 15px;
                background: #07e8d6;
                z-index:99999;
            
                aspect-ratio: 1;
                border-radius: 50%;
                --_m: 
                    conic-gradient(#0000,#000),
                    linear-gradient(#000 0 0) content-box;
                -webkit-mask: var(--_m);
                    mask: var(--_m);
                -webkit-mask-composite: source-out;
                    mask-composite: subtract;
                box-sizing: border-box;
                animation: load 1s linear infinite;
            }

            .spinnerContainerPrimary${this.elementID} {
                z-index:99999;
                background-color: rgba(128, 128, 128, 0.75);
                border: #666666 1px solid;
                border-radius: 5px;
                padding-top: 20px;
                padding-bottom: 10px;
                margin: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-80px, -80px);
                width: 180px;
                pointer-events: auto;
            }

            .spinnerPrimary${this.elementID} {
                width: 120px;
                margin-left: 30px;
            }

            .messageContainerPrimary${this.elementID} {
                padding-top: 15px;
            }

            .spinnerContainerMin${this.elementID} {
                z-index:99999;
                background-color: rgba(128, 128, 128, 0.75);
                border: #666666 1px solid;
                border-radius: 5px;
                padding-top: 20px;
                padding-bottom: 15px;
                margin: 0;
                position: absolute;
                bottom: 50px;
                left: 50%;
                transform: translate(-50%, 0);
                display: flex;
                flex-direction: left;
                pointer-events: auto;
                min-width: 250px;
            }

            .messageContainerMin${this.elementID} {
                margin-right: 15px;
            }

            .spinnerMin${this.elementID} {
                width: 50px;
                height: 50px;
                margin-left: 15px;
                margin-right: 25px;
            }

            .messageContainerMin${this.elementID} {
                padding-top: 15px;
            }
            
            @keyframes load {
                to{transform: rotate(1turn)}
            }

        `,this.spinnerContainerOuter.appendChild(n),this.container.appendChild(this.spinnerContainerOuter),this.setMinimized(!1,!0),this.fadeTransitions=[]}addTask(e){const t={message:e,id:this.taskIDGen++};return this.tasks.push(t),this.update(),t.id}removeTask(e){let t=0;for(let n of this.tasks){if(n.id===e){this.tasks.splice(t,1);break}t++}this.update()}removeAllTasks(){this.tasks=[],this.update()}setMessageForTask(e,t){for(let n of this.tasks)if(n.id===e){n.message=t;break}this.update()}update(){this.tasks.length>0?(this.show(),this.setMessage(this.tasks[this.tasks.length-1].message)):this.hide()}show(){this.spinnerContainerOuter.style.display="block",this.visible=!0}hide(){this.spinnerContainerOuter.style.display="none",this.visible=!1}setContainer(e){this.container&&this.spinnerContainerOuter.parentElement===this.container&&this.container.removeChild(this.spinnerContainerOuter),e&&(this.container=e,this.container.appendChild(this.spinnerContainerOuter),this.spinnerContainerOuter.style.zIndex=this.container.style.zIndex+1)}setMinimized(e,t){const n=(i,r,a,o,l)=>{a?i.style.display=r?o:"none":this.fadeTransitions[l]=D0(i,!r,o,F0,()=>{this.fadeTransitions[l]=null})};n(this.spinnerContainerPrimary,!e,t,"block",0),n(this.spinnerContainerMin,e,t,"flex",1),this.minimized=e}setMessage(e){this.messageContainerPrimary.innerHTML=e,this.messageContainerMin.innerHTML=e}};Z(gr,"elementIDGen",0);let no=gr;class L0{constructor(e){this.idGen=0,this.tasks=[],this.container=e||document.body,this.progressBarContainerOuter=document.createElement("div"),this.progressBarContainerOuter.className="progressBarOuterContainer",this.progressBarContainerOuter.style.display="none",this.progressBarBox=document.createElement("div"),this.progressBarBox.className="progressBarBox",this.progressBarBackground=document.createElement("div"),this.progressBarBackground.className="progressBarBackground",this.progressBar=document.createElement("div"),this.progressBar.className="progressBar",this.progressBarBackground.appendChild(this.progressBar),this.progressBarBox.appendChild(this.progressBarBackground),this.progressBarContainerOuter.appendChild(this.progressBarBox);const t=document.createElement("style");t.innerHTML=`

            .progressBarOuterContainer {
                width: 100%;
                height: 100%;
                margin: 0;
                top: 0;
                left: 0;
                position: absolute;
                pointer-events: none;
            }

            .progressBarBox {
                z-index:99999;
                padding: 7px 9px 5px 7px;
                background-color: rgba(190, 190, 190, 0.75);
                border: #555555 1px solid;
                border-radius: 15px;
                margin: 0;
                position: absolute;
                bottom: 50px;
                left: 50%;
                transform: translate(-50%, 0);
                width: 180px;
                height: 30px;
                pointer-events: auto;
            }

            .progressBarBackground {
                width: 100%;
                height: 25px;
                border-radius:10px;
                background-color: rgba(128, 128, 128, 0.75);
                border: #444444 1px solid;
                box-shadow: inset 0 0 10px #333333;
            }

            .progressBar {
                height: 25px;
                width: 0px;
                border-radius:10px;
                background-color: rgba(0, 200, 0, 0.75);
                box-shadow: inset 0 0 10px #003300;
            }

        `,this.progressBarContainerOuter.appendChild(t),this.container.appendChild(this.progressBarContainerOuter)}show(){this.progressBarContainerOuter.style.display="block"}hide(){this.progressBarContainerOuter.style.display="none"}setProgress(e){this.progressBar.style.width=e+"%"}setContainer(e){this.container&&this.progressBarContainerOuter.parentElement===this.container&&this.container.removeChild(this.progressBarContainerOuter),e&&(this.container=e,this.container.appendChild(this.progressBarContainerOuter),this.progressBarContainerOuter.style.zIndex=this.container.style.zIndex+1)}}class B0{constructor(e){Z(this,"update",function(e,t,n,i,r,a,o,l,c,u,d,p,h,g){const A=`${t.x.toFixed(5)}, ${t.y.toFixed(5)}, ${t.z.toFixed(5)}`;if(this.infoCells.cameraPosition.innerHTML!==A&&(this.infoCells.cameraPosition.innerHTML=A),n){const m=n,x=`${m.x.toFixed(5)}, ${m.y.toFixed(5)}, ${m.z.toFixed(5)}`;this.infoCells.cameraLookAt.innerHTML!==x&&(this.infoCells.cameraLookAt.innerHTML=x)}const f=`${i.x.toFixed(5)}, ${i.y.toFixed(5)}, ${i.z.toFixed(5)}`;if(this.infoCells.cameraUp.innerHTML!==f&&(this.infoCells.cameraUp.innerHTML=f),this.infoCells.orthographicCamera.innerHTML=r?"Orthographic":"Perspective",a){const m=a,x=`${m.x.toFixed(5)}, ${m.y.toFixed(5)}, ${m.z.toFixed(5)}`;this.infoCells.cursorPosition.innerHTML=x}else this.infoCells.cursorPosition.innerHTML="N/A";this.infoCells.fps.innerHTML=o,this.infoCells.renderWindow.innerHTML=`${e.x} x ${e.y}`,this.infoCells.renderSplatCount.innerHTML=`${c} splats out of ${l} (${u.toFixed(2)}%)`,this.infoCells.sortTime.innerHTML=`${d.toFixed(3)} ms`,this.infoCells.focalAdjustment.innerHTML=`${p.toFixed(3)}`,this.infoCells.splatScale.innerHTML=`${h.toFixed(3)}`,this.infoCells.pointCloudMode.innerHTML=`${g}`});this.container=e||document.body,this.infoCells={};const t=[["Camera position","cameraPosition"],["Camera look-at","cameraLookAt"],["Camera up","cameraUp"],["Camera mode","orthographicCamera"],["Cursor position","cursorPosition"],["FPS","fps"],["Rendering:","renderSplatCount"],["Sort time","sortTime"],["Render window","renderWindow"],["Focal adjustment","focalAdjustment"],["Splat scale","splatScale"],["Point cloud mode","pointCloudMode"]];this.infoPanelContainer=document.createElement("div");const n=document.createElement("style");n.innerHTML=`

            .infoPanel {
                width: 430px;
                padding: 10px;
                background-color: rgba(50, 50, 50, 0.85);
                border: #555555 2px solid;
                color: #dddddd;
                border-radius: 10px;
                z-index: 9999;
                font-family: arial;
                font-size: 11pt;
                text-align: left;
                margin: 0;
                top: 10px;
                left:10px;
                position: absolute;
                pointer-events: auto;
            }

            .info-panel-cell {
                margin-bottom: 5px;
                padding-bottom: 2px;
            }

            .label-cell {
                font-weight: bold;
                font-size: 12pt;
                width: 140px;
            }

        `,this.infoPanelContainer.append(n),this.infoPanel=document.createElement("div"),this.infoPanel.className="infoPanel";const i=document.createElement("div");i.style.display="table";for(let r of t){const a=document.createElement("div");a.style.display="table-row",a.className="info-panel-row";const o=document.createElement("div");o.style.display="table-cell",o.innerHTML=`${r[0]}: `,o.classList.add("info-panel-cell","label-cell");const l=document.createElement("div");l.style.display="table-cell",l.style.width="10px",l.innerHTML=" ",l.className="info-panel-cell";const c=document.createElement("div");c.style.display="table-cell",c.innerHTML="",c.className="info-panel-cell",this.infoCells[r[1]]=c,a.appendChild(o),a.appendChild(l),a.appendChild(c),i.appendChild(a)}this.infoPanel.appendChild(i),this.infoPanelContainer.append(this.infoPanel),this.infoPanelContainer.style.display="none",this.container.appendChild(this.infoPanelContainer),this.visible=!1}setContainer(e){this.container&&this.infoPanelContainer.parentElement===this.container&&this.container.removeChild(this.infoPanelContainer),e&&(this.container=e,this.container.appendChild(this.infoPanelContainer),this.infoPanelContainer.style.zIndex=this.container.style.zIndex+1)}show(){this.infoPanelContainer.style.display="block",this.visible=!0}hide(){this.infoPanelContainer.style.display="none",this.visible=!1}}const rc=new I;class U0 extends Ct{constructor(e=new I(0,0,1),t=new I(0,0,0),n=1,i=.1,r=16776960,a=n*.2,o=a*.2){super(),this.type="ArrowHelper";const l=new xs(i,i,n,32);l.translate(0,n/2,0);const c=new xs(0,o,a,32);c.translate(0,n,0),this.position.copy(t),this.line=new St(l,new hi({color:r,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new St(c,new hi({color:r,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{rc.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(rc,t)}}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class us{constructor(e){Z(this,"updateFocusMarker",function(){const e=new I,t=new ke,n=new I;return function(i,r,a){t.copy(r.matrixWorld).invert(),e.copy(i).applyMatrix4(t),e.normalize().multiplyScalar(10),e.applyMatrix4(r.matrixWorld),n.copy(r.position).sub(i);const o=n.length();this.focusMarker.position.copy(i),this.focusMarker.scale.set(o,o,o),this.focusMarker.material.uniforms.realFocusPosition.value.copy(i),this.focusMarker.material.uniforms.viewport.value.copy(a),this.focusMarker.material.uniformsNeedUpdate=!0}}());Z(this,"positionAndOrientControlPlane",function(){const e=new ut,t=new I(0,1,0);return function(n,i){e.setFromUnitVectors(t,i),this.controlPlane.position.copy(n),this.controlPlane.quaternion.copy(e)}}());this.threeScene=e,this.splatRenderTarget=null,this.renderTargetCopyQuad=null,this.renderTargetCopyCamera=null,this.meshCursor=null,this.focusMarker=null,this.controlPlane=null,this.debugRoot=null,this.secondaryDebugRoot=null}updateSplatRenderTargetForRenderDimensions(e,t){this.destroySplatRendertarget(),this.splatRenderTarget=new Yn(e,t,{format:Ot,stencilBuffer:!1,depthBuffer:!0}),this.splatRenderTarget.depthTexture=new go(e,t),this.splatRenderTarget.depthTexture.format=di,this.splatRenderTarget.depthTexture.type=nn}destroySplatRendertarget(){this.splatRenderTarget&&(this.splatRenderTarget=null)}setupRenderTargetCopyObjects(){const e={sourceColorTexture:{type:"t",value:null},sourceDepthTexture:{type:"t",value:null}},t=new jt({vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4( position.xy, 0.0, 1.0 );    
                }
            `,fragmentShader:`
                #include <common>
                #include <packing>
                varying vec2 vUv;
                uniform sampler2D sourceColorTexture;
                uniform sampler2D sourceDepthTexture;
                void main() {
                    vec4 color = texture2D(sourceColorTexture, vUv);
                    float fragDepth = texture2D(sourceDepthTexture, vUv).x;
                    gl_FragDepth = fragDepth;
                    gl_FragColor = vec4(color.rgb, color.a * 2.0);
              }
            `,uniforms:e,depthWrite:!1,depthTest:!1,transparent:!0,blending:fc,blendSrc:ps,blendSrcAlpha:ps,blendDst:ms,blendDstAlpha:ms});t.extensions.fragDepth=!0,this.renderTargetCopyQuad=new St(new Ki(2,2),t),this.renderTargetCopyCamera=new po(-1,1,1,-1,0,1)}destroyRenderTargetCopyObjects(){this.renderTargetCopyQuad&&(Bi(this.renderTargetCopyQuad),this.renderTargetCopyQuad=null)}setupMeshCursor(){if(!this.meshCursor){const e=new Ao(.5,1.5,32),t=new hi({color:16777215}),n=new St(e,t);n.rotation.set(0,0,Math.PI),n.position.set(0,1,0);const i=new St(e,t);i.position.set(0,-1,0);const r=new St(e,t);r.rotation.set(0,0,Math.PI/2),r.position.set(1,0,0);const a=new St(e,t);a.rotation.set(0,0,-Math.PI/2),a.position.set(-1,0,0),this.meshCursor=new Ct,this.meshCursor.add(n),this.meshCursor.add(i),this.meshCursor.add(r),this.meshCursor.add(a),this.meshCursor.scale.set(.1,.1,.1),this.threeScene.add(this.meshCursor),this.meshCursor.visible=!1}}destroyMeshCursor(){this.meshCursor&&(Bi(this.meshCursor),this.threeScene.remove(this.meshCursor),this.meshCursor=null)}setMeshCursorVisibility(e){this.meshCursor.visible=e}getMeschCursorVisibility(){return this.meshCursor.visible}setMeshCursorPosition(e){this.meshCursor.position.copy(e)}positionAndOrientMeshCursor(e,t){this.meshCursor.position.copy(e),this.meshCursor.up.copy(t.up),this.meshCursor.lookAt(t.position)}setupFocusMarker(){if(!this.focusMarker){const e=new hr(.5,32,32),t=us.buildFocusMarkerMaterial();t.depthTest=!1,t.depthWrite=!1,t.transparent=!0,this.focusMarker=new St(e,t)}}destroyFocusMarker(){this.focusMarker&&(Bi(this.focusMarker),this.focusMarker=null)}setFocusMarkerVisibility(e){this.focusMarker.visible=e}setFocusMarkerOpacity(e){this.focusMarker.material.uniforms.opacity.value=e,this.focusMarker.material.uniformsNeedUpdate=!0}getFocusMarkerOpacity(){return this.focusMarker.material.uniforms.opacity.value}setupControlPlane(){if(!this.controlPlane){const e=new Ki(1,1);e.rotateX(-Math.PI/2);const t=new hi({color:16777215});t.transparent=!0,t.opacity=.6,t.depthTest=!1,t.depthWrite=!1,t.side=tn;const n=new St(e,t),i=new I(0,1,0);i.normalize();const r=new I(0,0,0),a=.5,o=.01,l=56576,c=new U0(i,r,a,o,l,.1,.03);this.controlPlane=new Ct,this.controlPlane.add(n),this.controlPlane.add(c)}}destroyControlPlane(){this.controlPlane&&(Bi(this.controlPlane),this.controlPlane=null)}setControlPlaneVisibility(e){this.controlPlane.visible=e}addDebugMeshes(){this.debugRoot=this.createDebugMeshes(),this.secondaryDebugRoot=this.createSecondaryDebugMeshes(),this.threeScene.add(this.debugRoot),this.threeScene.add(this.secondaryDebugRoot)}destroyDebugMeshes(){for(let e of[this.debugRoot,this.secondaryDebugRoot])e&&(Bi(e),this.threeScene.remove(e));this.debugRoot=null,this.secondaryDebugRoot=null}createDebugMeshes(e){const t=new hr(1,32,32),n=new Ct,i=(r,a)=>{let o=new St(t,us.buildDebugMaterial(r));o.renderOrder=e,n.add(o),o.position.fromArray(a)};return i(16711680,[-50,0,0]),i(16711680,[50,0,0]),i(65280,[0,0,-50]),i(65280,[0,0,50]),i(16755200,[5,0,5]),n}createSecondaryDebugMeshes(e){const t=new Ji(3,3,3),n=new Ct;let i=12303291;const r=o=>{let l=new St(t,us.buildDebugMaterial(i));l.renderOrder=e,n.add(l),l.position.fromArray(o)};let a=10;return r([-a,0,-a]),r([-a,0,a]),r([a,0,-a]),r([a,0,a]),n}static buildDebugMaterial(e){const t=`
            #include <common>
            varying float ndcDepth;

            void main() {
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position.xyz, 1.0);
                ndcDepth = gl_Position.z / gl_Position.w;
                gl_Position.x = gl_Position.x / gl_Position.w;
                gl_Position.y = gl_Position.y / gl_Position.w;
                gl_Position.z = 0.0;
                gl_Position.w = 1.0;
    
            }
        `,n=`
            #include <common>
            uniform vec3 color;
            varying float ndcDepth;
            void main() {
                gl_FragDepth = (ndcDepth + 1.0) / 2.0;
                gl_FragColor = vec4(color.rgb, 0.0);
            }
        `,i={color:{type:"v3",value:new Ze(e)}},r=new jt({uniforms:i,vertexShader:t,fragmentShader:n,transparent:!1,depthTest:!0,depthWrite:!0,side:An});return r.extensions.fragDepth=!0,r}static buildFocusMarkerMaterial(e){const t=`
            #include <common>

            uniform vec2 viewport;
            uniform vec3 realFocusPosition;

            varying vec4 ndcPosition;
            varying vec4 ndcCenter;
            varying vec4 ndcFocusPosition;

            void main() {
                float radius = 0.01;

                vec4 viewPosition = modelViewMatrix * vec4(position.xyz, 1.0);
                vec4 viewCenter = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);

                vec4 viewFocusPosition = modelViewMatrix * vec4(realFocusPosition, 1.0);

                ndcPosition = projectionMatrix * viewPosition;
                ndcPosition = ndcPosition * vec4(1.0 / ndcPosition.w);
                ndcCenter = projectionMatrix * viewCenter;
                ndcCenter = ndcCenter * vec4(1.0 / ndcCenter.w);

                ndcFocusPosition = projectionMatrix * viewFocusPosition;
                ndcFocusPosition = ndcFocusPosition * vec4(1.0 / ndcFocusPosition.w);

                gl_Position = projectionMatrix * viewPosition;

            }
        `,n=`
            #include <common>
            uniform vec3 color;
            uniform vec2 viewport;
            uniform float opacity;

            varying vec4 ndcPosition;
            varying vec4 ndcCenter;
            varying vec4 ndcFocusPosition;

            void main() {
                vec2 screenPosition = vec2(ndcPosition) * viewport;
                vec2 screenCenter = vec2(ndcCenter) * viewport;

                vec2 screenVec = screenPosition - screenCenter;

                float projectedRadius = length(screenVec);

                float lineWidth = 0.0005 * viewport.y;
                float aaRange = 0.0025 * viewport.y;
                float radius = 0.06 * viewport.y;
                float radDiff = abs(projectedRadius - radius) - lineWidth;
                float alpha = 1.0 - clamp(radDiff / 5.0, 0.0, 1.0); 

                gl_FragColor = vec4(color.rgb, alpha * opacity);
            }
        `,i={color:{type:"v3",value:new Ze(e)},realFocusPosition:{type:"v3",value:new I},viewport:{type:"v2",value:new Me},opacity:{value:0}};return new jt({uniforms:i,vertexShader:t,fragmentShader:n,transparent:!0,depthTest:!1,depthWrite:!1,side:An})}dispose(){this.destroyMeshCursor(),this.destroyFocusMarker(),this.destroyDebugMeshes(),this.destroyControlPlane(),this.destroyRenderTargetCopyObjects(),this.destroySplatRendertarget()}}const O0=new I(1,0,0),N0=new I(0,1,0),z0=new I(0,0,1);class ua{constructor(e=new I,t=new I){Z(this,"intersectBox",function(){const e=new I,t=[],n=[],i=[];return function(r,a){if(n[0]=this.origin.x,n[1]=this.origin.y,n[2]=this.origin.z,i[0]=this.direction.x,i[1]=this.direction.y,i[2]=this.direction.z,this.boxContainsPoint(r,this.origin,1e-4))return a&&(a.origin.copy(this.origin),a.normal.set(0,0,0),a.distance=-1),!0;for(let o=0;o<3;o++){if(i[o]==0)continue;const l=o==0?O0:o==1?N0:z0,c=i[o]<0?r.max:r.min;let u=-Math.sign(i[o]);t[0]=o==0?c.x:o==1?c.y:c.z;let d=t[0]-n[o];if(d*u<0){const p=(o+1)%3,h=(o+2)%3;if(t[2]=i[p]/i[o]*d+n[p],t[1]=i[h]/i[o]*d+n[h],e.set(t[o],t[h],t[p]),this.boxContainsPoint(r,e,1e-4))return a&&(a.origin.copy(e),a.normal.copy(l).multiplyScalar(u),a.distance=e.sub(this.origin).length()),!0}}return!1}}());Z(this,"intersectSphere",function(){const e=new I;return function(t,n,i){e.copy(t).sub(this.origin);const r=e.dot(this.direction),a=r*r,l=e.dot(e)-a,c=n*n;if(l>c)return!1;const u=Math.sqrt(c-l),d=r-u,p=r+u;if(p<0)return!1;let h=d<0?p:d;return i&&(i.origin.copy(this.origin).addScaledVector(this.direction,h),i.normal.copy(i.origin).sub(t).normalize(),i.distance=h),!0}}());this.origin=new I,this.direction=new I,this.setParameters(e,t)}setParameters(e,t){this.origin.copy(e),this.direction.copy(t).normalize()}boxContainsPoint(e,t,n){return!(t.x<e.min.x-n||t.x>e.max.x+n||t.y<e.min.y-n||t.y>e.max.y+n||t.z<e.min.z-n||t.z>e.max.z+n)}}class Do{constructor(){this.origin=new I,this.normal=new I,this.distance=0,this.splatIndex=0}set(e,t,n,i){this.origin.copy(e),this.normal.copy(t),this.distance=n,this.splatIndex=i}clone(){const e=new Do;return e.origin.copy(this.origin),e.normal.copy(this.normal),e.distance=this.distance,e.splatIndex=this.splatIndex,e}}const wn={ThreeD:0,TwoD:1};class k0{constructor(e,t,n=!1){Z(this,"setFromCameraAndScreenPosition",function(){const e=new Me;return function(t,n,i){if(e.x=n.x/i.x*2-1,e.y=(i.y-n.y)/i.y*2-1,t.isPerspectiveCamera)this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t;else if(t.isOrthographicCamera)this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t;else throw new Error("Raycaster::setFromCameraAndScreenPosition() -> Unsupported camera type")}}());Z(this,"intersectSplatMesh",function(){const e=new ke,t=new ke,n=new ke,i=new ua,r=new I;return function(a,o=[]){const l=a.getSplatTree();if(l){for(let c=0;c<l.subTrees.length;c++){const u=l.subTrees[c];t.copy(a.matrixWorld),a.dynamicMode&&(a.getSceneTransform(c,n),t.multiply(n)),e.copy(t).invert(),i.origin.copy(this.ray.origin).applyMatrix4(e),i.direction.copy(this.ray.origin).add(this.ray.direction),i.direction.applyMatrix4(e).sub(i.origin).normalize();const d=[];u.rootNode&&this.castRayAtSplatTreeNode(i,l,u.rootNode,d),d.forEach(p=>{p.origin.applyMatrix4(t),p.normal.applyMatrix4(t).normalize(),p.distance=r.copy(p.origin).sub(this.ray.origin).length()}),o.push(...d)}return o.sort((c,u)=>c.distance>u.distance?1:-1),o}}}());Z(this,"castRayAtSplatTreeNode",function(){const e=new ft,t=new I,n=new I,i=new ut,r=new Do,a=1e-7,o=new I(0,0,0),l=new ke,c=new ke,u=new ke,d=new ke,p=new ke,h=new ua;return function(g,A,f,m=[]){if(g.intersectBox(f.boundingBox)){if(f.data&&f.data.indexes&&f.data.indexes.length>0)for(let x=0;x<f.data.indexes.length;x++){const v=f.data.indexes[x],y=A.splatMesh.getSceneIndexForSplat(v);if(A.splatMesh.getScene(y).visible&&(A.splatMesh.getSplatColor(v,e),A.splatMesh.getSplatCenter(v,t),A.splatMesh.getSplatScaleAndRotation(v,n,i),!(n.x<=a||n.y<=a||A.splatMesh.splatRenderMode===wn.ThreeD&&n.z<=a)))if(this.raycastAgainstTrueSplatEllipsoid){c.makeScale(n.x,n.y,n.z),u.makeRotationFromQuaternion(i);const E=Math.log10(e.w)*2;if(l.makeScale(E,E,E),p.copy(l).multiply(u).multiply(c),d.copy(p).invert(),h.origin.copy(g.origin).sub(t).applyMatrix4(d),h.direction.copy(g.origin).add(g.direction).sub(t),h.direction.applyMatrix4(d).sub(h.origin).normalize(),h.intersectSphere(o,1,r)){const _=r.clone();_.splatIndex=v,_.origin.applyMatrix4(p).add(t),m.push(_)}}else{let E=n.x+n.y,_=2;if(A.splatMesh.splatRenderMode===wn.ThreeD&&(E+=n.z,_=3),E=E/_,g.intersectSphere(t,E,r)){const w=r.clone();w.splatIndex=v,m.push(w)}}}if(f.children&&f.children.length>0)for(let x of f.children)this.castRayAtSplatTreeNode(g,A,x,m);return m}}}());this.ray=new ua(e,t),this.raycastAgainstTrueSplatEllipsoid=n}}class Hi{static buildVertexShaderBase(e=!1,t=!1,n=0,i=""){let r=`
        precision highp float;
        #include <common>

        attribute uint splatIndex;
        uniform highp usampler2D centersColorsTexture;
        uniform highp sampler2D sphericalHarmonicsTexture;
        uniform highp sampler2D sphericalHarmonicsTextureR;
        uniform highp sampler2D sphericalHarmonicsTextureG;
        uniform highp sampler2D sphericalHarmonicsTextureB;

        uniform highp usampler2D sceneIndexesTexture;
        uniform vec2 sceneIndexesTextureSize;
        uniform int sceneCount;
    `;return t&&(r+=`
            uniform float sceneOpacity[${Qe.MaxScenes}];
            uniform int sceneVisibility[${Qe.MaxScenes}];
        `),e&&(r+=`
            uniform highp mat4 transforms[${Qe.MaxScenes}];
        `),r+=`
        ${i}
        uniform vec2 focal;
        uniform float orthoZoom;
        uniform int orthographicMode;
        uniform int pointCloudModeEnabled;
        uniform float inverseFocalAdjustment;
        uniform vec2 viewport;
        uniform vec2 basisViewport;
        uniform vec2 centersColorsTextureSize;
        uniform int sphericalHarmonicsDegree;
        uniform vec2 sphericalHarmonicsTextureSize;
        uniform int sphericalHarmonics8BitMode;
        uniform int sphericalHarmonicsMultiTextureMode;
        uniform float visibleRegionRadius;
        uniform float visibleRegionFadeStartRadius;
        uniform float firstRenderTime;
        uniform float currentTime;
        uniform int fadeInComplete;
        uniform vec3 sceneCenter;
        uniform float splatScale;
        uniform float sphericalHarmonics8BitCompressionRangeMin[${Qe.MaxScenes}];
        uniform float sphericalHarmonics8BitCompressionRangeMax[${Qe.MaxScenes}];

        varying vec4 vColor;
        varying vec2 vUv;
        varying vec2 vPosition;

        mat3 quaternionToRotationMatrix(float x, float y, float z, float w) {
            float s = 1.0 / sqrt(w * w + x * x + y * y + z * z);
        
            return mat3(
                1. - 2. * (y * y + z * z),
                2. * (x * y + w * z),
                2. * (x * z - w * y),
                2. * (x * y - w * z),
                1. - 2. * (x * x + z * z),
                2. * (y * z + w * x),
                2. * (x * z + w * y),
                2. * (y * z - w * x),
                1. - 2. * (x * x + y * y)
            );
        }

        const float sqrt8 = sqrt(8.0);
        const float minAlpha = 1.0 / 255.0;

        const vec4 encodeNorm4 = vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0);
        const uvec4 mask4 = uvec4(uint(0x000000FF), uint(0x0000FF00), uint(0x00FF0000), uint(0xFF000000));
        const uvec4 shift4 = uvec4(0, 8, 16, 24);
        vec4 uintToRGBAVec (uint u) {
           uvec4 urgba = mask4 & u;
           urgba = urgba >> shift4;
           vec4 rgba = vec4(urgba) * encodeNorm4;
           return rgba;
        }

        vec2 getDataUV(in int stride, in int offset, in vec2 dimensions) {
            vec2 samplerUV = vec2(0.0, 0.0);
            float d = float(splatIndex * uint(stride) + uint(offset)) / dimensions.x;
            samplerUV.y = float(floor(d)) / dimensions.y;
            samplerUV.x = fract(d);
            return samplerUV;
        }

        vec2 getDataUVF(in uint sIndex, in float stride, in uint offset, in vec2 dimensions) {
            vec2 samplerUV = vec2(0.0, 0.0);
            float d = float(uint(float(sIndex) * stride) + offset) / dimensions.x;
            samplerUV.y = float(floor(d)) / dimensions.y;
            samplerUV.x = fract(d);
            return samplerUV;
        }

        const float SH_C1 = 0.4886025119029199f;
        const float[5] SH_C2 = float[](1.0925484, -1.0925484, 0.3153916, -1.0925484, 0.5462742);

        void main () {

            uint oddOffset = splatIndex & uint(0x00000001);
            uint doubleOddOffset = oddOffset * uint(2);
            bool isEven = oddOffset == uint(0);
            uint nearestEvenIndex = splatIndex - oddOffset;
            float fOddOffset = float(oddOffset);

            uvec4 sampledCenterColor = texture(centersColorsTexture, getDataUV(1, 0, centersColorsTextureSize));
            vec3 splatCenter = uintBitsToFloat(uvec3(sampledCenterColor.gba));

            uint sceneIndex = uint(0);
            if (sceneCount > 1) {
                sceneIndex = texture(sceneIndexesTexture, getDataUV(1, 0, sceneIndexesTextureSize)).r;
            }
            `,t&&(r+=`
                float splatOpacityFromScene = sceneOpacity[sceneIndex];
                int sceneVisible = sceneVisibility[sceneIndex];
                if (splatOpacityFromScene <= 0.01 || sceneVisible == 0) {
                    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
                    return;
                }
            `),e?r+=`
                mat4 transform = transforms[sceneIndex];
                mat4 transformModelViewMatrix = viewMatrix * transform;
            `:r+="mat4 transformModelViewMatrix = modelViewMatrix;",r+=`
            float sh8BitCompressionRangeMinForScene = sphericalHarmonics8BitCompressionRangeMin[sceneIndex];
            float sh8BitCompressionRangeMaxForScene = sphericalHarmonics8BitCompressionRangeMax[sceneIndex];
            float sh8BitCompressionRangeForScene = sh8BitCompressionRangeMaxForScene - sh8BitCompressionRangeMinForScene;
            float sh8BitCompressionHalfRangeForScene = sh8BitCompressionRangeForScene / 2.0;
            vec3 vec8BitSHShift = vec3(sh8BitCompressionRangeMinForScene);

            vec4 viewCenter = transformModelViewMatrix * vec4(splatCenter, 1.0);

            vec4 clipCenter = projectionMatrix * viewCenter;

            float clip = 1.2 * clipCenter.w;
            if (clipCenter.z < -clip || clipCenter.x < -clip || clipCenter.x > clip || clipCenter.y < -clip || clipCenter.y > clip) {
                gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
                return;
            }

            vec3 ndcCenter = clipCenter.xyz / clipCenter.w;

            vPosition = position.xy;
            vColor = uintToRGBAVec(sampledCenterColor.r);
        `,n>=1&&(r+=`   
            if (sphericalHarmonicsDegree >= 1) {
            `,e?r+=`
                    vec3 worldViewDir = normalize(splatCenter - vec3(inverse(transform) * vec4(cameraPosition, 1.0)));
                `:r+=`
                    vec3 worldViewDir = normalize(splatCenter - cameraPosition);
                `,r+=`
                vec3 sh1;
                vec3 sh2;
                vec3 sh3;
            `,n>=2&&(r+=`
                    vec3 sh4;
                    vec3 sh5;
                    vec3 sh6;
                    vec3 sh7;
                    vec3 sh8;
                `),n===1?r+=`
                    if (sphericalHarmonicsMultiTextureMode == 0) {
                        vec2 shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset, sphericalHarmonicsTextureSize);
                        vec4 sampledSH0123 = texture(sphericalHarmonicsTexture, shUV);
                        shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset + uint(1), sphericalHarmonicsTextureSize);
                        vec4 sampledSH4567 = texture(sphericalHarmonicsTexture, shUV);
                        shUV = getDataUVF(nearestEvenIndex, 2.5, doubleOddOffset + uint(2), sphericalHarmonicsTextureSize);
                        vec4 sampledSH891011 = texture(sphericalHarmonicsTexture, shUV);
                        sh1 = vec3(sampledSH0123.rgb) * (1.0 - fOddOffset) + vec3(sampledSH0123.ba, sampledSH4567.r) * fOddOffset;
                        sh2 = vec3(sampledSH0123.a, sampledSH4567.rg) * (1.0 - fOddOffset) + vec3(sampledSH4567.gba) * fOddOffset;
                        sh3 = vec3(sampledSH4567.ba, sampledSH891011.r) * (1.0 - fOddOffset) + vec3(sampledSH891011.rgb) * fOddOffset;
                    } else {
                        vec2 sampledSH01R = texture(sphericalHarmonicsTextureR, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH23R = texture(sphericalHarmonicsTextureR, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH01G = texture(sphericalHarmonicsTextureG, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH23G = texture(sphericalHarmonicsTextureG, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH01B = texture(sphericalHarmonicsTextureB, getDataUV(2, 0, sphericalHarmonicsTextureSize)).rg;
                        vec2 sampledSH23B = texture(sphericalHarmonicsTextureB, getDataUV(2, 1, sphericalHarmonicsTextureSize)).rg;
                        sh1 = vec3(sampledSH01R.rg, sampledSH23R.r);
                        sh2 = vec3(sampledSH01G.rg, sampledSH23G.r);
                        sh3 = vec3(sampledSH01B.rg, sampledSH23B.r);
                    }
                `:n===2&&(r+=`
                    vec4 sampledSH0123;
                    vec4 sampledSH4567;
                    vec4 sampledSH891011;

                    vec4 sampledSH0123R;
                    vec4 sampledSH0123G;
                    vec4 sampledSH0123B;

                    if (sphericalHarmonicsMultiTextureMode == 0) {
                        sampledSH0123 = texture(sphericalHarmonicsTexture, getDataUV(6, 0, sphericalHarmonicsTextureSize));
                        sampledSH4567 = texture(sphericalHarmonicsTexture, getDataUV(6, 1, sphericalHarmonicsTextureSize));
                        sampledSH891011 = texture(sphericalHarmonicsTexture, getDataUV(6, 2, sphericalHarmonicsTextureSize));
                        sh1 = sampledSH0123.rgb;
                        sh2 = vec3(sampledSH0123.a, sampledSH4567.rg);
                        sh3 = vec3(sampledSH4567.ba, sampledSH891011.r);
                    } else {
                        sampledSH0123R = texture(sphericalHarmonicsTextureR, getDataUV(2, 0, sphericalHarmonicsTextureSize));
                        sampledSH0123G = texture(sphericalHarmonicsTextureG, getDataUV(2, 0, sphericalHarmonicsTextureSize));
                        sampledSH0123B = texture(sphericalHarmonicsTextureB, getDataUV(2, 0, sphericalHarmonicsTextureSize));
                        sh1 = vec3(sampledSH0123R.rgb);
                        sh2 = vec3(sampledSH0123G.rgb);
                        sh3 = vec3(sampledSH0123B.rgb);
                    }
                `),r+=`
                    if (sphericalHarmonics8BitMode == 1) {
                        sh1 = sh1 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                        sh2 = sh2 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                        sh3 = sh3 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                    }
                    float x = worldViewDir.x;
                    float y = worldViewDir.y;
                    float z = worldViewDir.z;
                    vColor.rgb += SH_C1 * (-sh1 * y + sh2 * z - sh3 * x);
            `,n>=2&&(r+=`
                    if (sphericalHarmonicsDegree >= 2) {
                        float xx = x * x;
                        float yy = y * y;
                        float zz = z * z;
                        float xy = x * y;
                        float yz = y * z;
                        float xz = x * z;
                `,n===2&&(r+=`
                        if (sphericalHarmonicsMultiTextureMode == 0) {
                            vec4 sampledSH12131415 = texture(sphericalHarmonicsTexture, getDataUV(6, 3, sphericalHarmonicsTextureSize));
                            vec4 sampledSH16171819 = texture(sphericalHarmonicsTexture, getDataUV(6, 4, sphericalHarmonicsTextureSize));
                            vec4 sampledSH20212223 = texture(sphericalHarmonicsTexture, getDataUV(6, 5, sphericalHarmonicsTextureSize));
                            sh4 = sampledSH891011.gba;
                            sh5 = sampledSH12131415.rgb;
                            sh6 = vec3(sampledSH12131415.a, sampledSH16171819.rg);
                            sh7 = vec3(sampledSH16171819.ba, sampledSH20212223.r);
                            sh8 = sampledSH20212223.gba;
                        } else {
                            vec4 sampledSH4567R = texture(sphericalHarmonicsTextureR, getDataUV(2, 1, sphericalHarmonicsTextureSize));
                            vec4 sampledSH4567G = texture(sphericalHarmonicsTextureG, getDataUV(2, 1, sphericalHarmonicsTextureSize));
                            vec4 sampledSH4567B = texture(sphericalHarmonicsTextureB, getDataUV(2, 1, sphericalHarmonicsTextureSize));
                            sh4 = vec3(sampledSH0123R.a, sampledSH4567R.rg);
                            sh5 = vec3(sampledSH4567R.ba, sampledSH0123G.a);
                            sh6 = vec3(sampledSH4567G.rgb);
                            sh7 = vec3(sampledSH4567G.a, sampledSH0123B.a, sampledSH4567B.r);
                            sh8 = vec3(sampledSH4567B.gba);
                        }
                    `),r+=`
                        if (sphericalHarmonics8BitMode == 1) {
                            sh4 = sh4 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                            sh5 = sh5 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                            sh6 = sh6 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                            sh7 = sh7 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                            sh8 = sh8 * sh8BitCompressionRangeForScene + vec8BitSHShift;
                        }

                        vColor.rgb +=
                            (SH_C2[0] * xy) * sh4 +
                            (SH_C2[1] * yz) * sh5 +
                            (SH_C2[2] * (2.0 * zz - xx - yy)) * sh6 +
                            (SH_C2[3] * xz) * sh7 +
                            (SH_C2[4] * (xx - yy)) * sh8;
                    }
                `),r+=`

                vColor.rgb = clamp(vColor.rgb, vec3(0.), vec3(1.));

            }

            `),r}static getVertexShaderFadeIn(){return`
            if (fadeInComplete == 0) {
                float opacityAdjust = 1.0;
                float centerDist = length(splatCenter - sceneCenter);
                float renderTime = max(currentTime - firstRenderTime, 0.0);

                float fadeDistance = 0.75;
                float distanceLoadFadeInFactor = step(visibleRegionFadeStartRadius, centerDist);
                distanceLoadFadeInFactor = (1.0 - distanceLoadFadeInFactor) +
                                        (1.0 - clamp((centerDist - visibleRegionFadeStartRadius) / fadeDistance, 0.0, 1.0)) *
                                        distanceLoadFadeInFactor;
                opacityAdjust *= distanceLoadFadeInFactor;
                vColor.a *= opacityAdjust;
            }
        `}static getUniforms(e=!1,t=!1,n=0,i=1,r=!1){const a={sceneCenter:{type:"v3",value:new I},fadeInComplete:{type:"i",value:0},orthographicMode:{type:"i",value:0},visibleRegionFadeStartRadius:{type:"f",value:0},visibleRegionRadius:{type:"f",value:0},currentTime:{type:"f",value:0},firstRenderTime:{type:"f",value:0},centersColorsTexture:{type:"t",value:null},sphericalHarmonicsTexture:{type:"t",value:null},sphericalHarmonicsTextureR:{type:"t",value:null},sphericalHarmonicsTextureG:{type:"t",value:null},sphericalHarmonicsTextureB:{type:"t",value:null},sphericalHarmonics8BitCompressionRangeMin:{type:"f",value:[]},sphericalHarmonics8BitCompressionRangeMax:{type:"f",value:[]},focal:{type:"v2",value:new Me},orthoZoom:{type:"f",value:1},inverseFocalAdjustment:{type:"f",value:1},viewport:{type:"v2",value:new Me},basisViewport:{type:"v2",value:new Me},debugColor:{type:"v3",value:new Ze},centersColorsTextureSize:{type:"v2",value:new Me(1024,1024)},sphericalHarmonicsDegree:{type:"i",value:n},sphericalHarmonicsTextureSize:{type:"v2",value:new Me(1024,1024)},sphericalHarmonics8BitMode:{type:"i",value:0},sphericalHarmonicsMultiTextureMode:{type:"i",value:0},splatScale:{type:"f",value:i},pointCloudModeEnabled:{type:"i",value:r?1:0},sceneIndexesTexture:{type:"t",value:null},sceneIndexesTextureSize:{type:"v2",value:new Me(1024,1024)},sceneCount:{type:"i",value:1}};for(let o=0;o<Qe.MaxScenes;o++)a.sphericalHarmonics8BitCompressionRangeMin.value.push(-3/2),a.sphericalHarmonics8BitCompressionRangeMax.value.push(Qe.SphericalHarmonics8BitCompressionRange/2);if(t){const o=[];for(let c=0;c<Qe.MaxScenes;c++)o.push(1);a.sceneOpacity={type:"f",value:o};const l=[];for(let c=0;c<Qe.MaxScenes;c++)l.push(1);a.sceneVisibility={type:"i",value:l}}if(e){const o=[];for(let l=0;l<Qe.MaxScenes;l++)o.push(new ke);a.transforms={type:"mat4",value:o}}return a}}class pr{static build(e=!1,t=!1,n=!1,i=2048,r=1,a=!1,o=0,l=.3){let u=Hi.buildVertexShaderBase(e,t,o,`
            uniform vec2 covariancesTextureSize;
            uniform highp sampler2D covariancesTexture;
            uniform highp usampler2D covariancesTextureHalfFloat;
            uniform int covariancesAreHalfFloat;

            void fromCovarianceHalfFloatV4(uvec4 val, out vec4 first, out vec4 second) {
                vec2 r = unpackHalf2x16(val.r);
                vec2 g = unpackHalf2x16(val.g);
                vec2 b = unpackHalf2x16(val.b);

                first = vec4(r.x, r.y, g.x, g.y);
                second = vec4(b.x, b.y, 0.0, 0.0);
            }
        `);u+=pr.buildVertexShaderProjection(n,t,i,l);const d=pr.buildFragmentShader(),p=Hi.getUniforms(e,t,o,r,a);return p.covariancesTextureSize={type:"v2",value:new Me(1024,1024)},p.covariancesTexture={type:"t",value:null},p.covariancesTextureHalfFloat={type:"t",value:null},p.covariancesAreHalfFloat={type:"i",value:0},new jt({uniforms:p,vertexShader:u,fragmentShader:d,transparent:!0,alphaTest:1,blending:qn,depthTest:!0,depthWrite:!1,side:tn})}static buildVertexShaderProjection(e,t,n,i){let r=`

            vec4 sampledCovarianceA;
            vec4 sampledCovarianceB;
            vec3 cov3D_M11_M12_M13;
            vec3 cov3D_M22_M23_M33;
            if (covariancesAreHalfFloat == 0) {
                sampledCovarianceA = texture(covariancesTexture, getDataUVF(nearestEvenIndex, 1.5, oddOffset,
                                                                            covariancesTextureSize));
                sampledCovarianceB = texture(covariancesTexture, getDataUVF(nearestEvenIndex, 1.5, oddOffset + uint(1),
                                                                            covariancesTextureSize));

                cov3D_M11_M12_M13 = vec3(sampledCovarianceA.rgb) * (1.0 - fOddOffset) +
                                    vec3(sampledCovarianceA.ba, sampledCovarianceB.r) * fOddOffset;
                cov3D_M22_M23_M33 = vec3(sampledCovarianceA.a, sampledCovarianceB.rg) * (1.0 - fOddOffset) +
                                    vec3(sampledCovarianceB.gba) * fOddOffset;
            } else {
                uvec4 sampledCovarianceU = texture(covariancesTextureHalfFloat, getDataUV(1, 0, covariancesTextureSize));
                fromCovarianceHalfFloatV4(sampledCovarianceU, sampledCovarianceA, sampledCovarianceB);
                cov3D_M11_M12_M13 = sampledCovarianceA.rgb;
                cov3D_M22_M23_M33 = vec3(sampledCovarianceA.a, sampledCovarianceB.rg);
            }
        
            // Construct the 3D covariance matrix
            mat3 Vrk = mat3(
                cov3D_M11_M12_M13.x, cov3D_M11_M12_M13.y, cov3D_M11_M12_M13.z,
                cov3D_M11_M12_M13.y, cov3D_M22_M23_M33.x, cov3D_M22_M23_M33.y,
                cov3D_M11_M12_M13.z, cov3D_M22_M23_M33.y, cov3D_M22_M23_M33.z
            );

            mat3 J;
            if (orthographicMode == 1) {
                // Since the projection is linear, we don't need an approximation
                J = transpose(mat3(orthoZoom, 0.0, 0.0,
                                0.0, orthoZoom, 0.0,
                                0.0, 0.0, 0.0));
            } else {
                // Construct the Jacobian of the affine approximation of the projection matrix. It will be used to transform the
                // 3D covariance matrix instead of using the actual projection matrix because that transformation would
                // require a non-linear component (perspective division) which would yield a non-gaussian result.
                float s = 1.0 / (viewCenter.z * viewCenter.z);
                J = mat3(
                    focal.x / viewCenter.z, 0., -(focal.x * viewCenter.x) * s,
                    0., focal.y / viewCenter.z, -(focal.y * viewCenter.y) * s,
                    0., 0., 0.
                );
            }

            // Concatenate the projection approximation with the model-view transformation
            mat3 W = transpose(mat3(transformModelViewMatrix));
            mat3 T = W * J;

            // Transform the 3D covariance matrix (Vrk) to compute the 2D covariance matrix
            mat3 cov2Dm = transpose(T) * Vrk * T;
            `;return e?r+=`
                float detOrig = cov2Dm[0][0] * cov2Dm[1][1] - cov2Dm[0][1] * cov2Dm[0][1];
                cov2Dm[0][0] += ${i};
                cov2Dm[1][1] += ${i};
                float detBlur = cov2Dm[0][0] * cov2Dm[1][1] - cov2Dm[0][1] * cov2Dm[0][1];
                vColor.a *= sqrt(max(detOrig / detBlur, 0.0));
                if (vColor.a < minAlpha) return;
            `:r+=`
                cov2Dm[0][0] += ${i};
                cov2Dm[1][1] += ${i};
            `,r+=`

            // We are interested in the upper-left 2x2 portion of the projected 3D covariance matrix because
            // we only care about the X and Y values. We want the X-diagonal, cov2Dm[0][0],
            // the Y-diagonal, cov2Dm[1][1], and the correlation between the two cov2Dm[0][1]. We don't
            // need cov2Dm[1][0] because it is a symetric matrix.
            vec3 cov2Dv = vec3(cov2Dm[0][0], cov2Dm[0][1], cov2Dm[1][1]);

            // We now need to solve for the eigen-values and eigen vectors of the 2D covariance matrix
            // so that we can determine the 2D basis for the splat. This is done using the method described
            // here: https://people.math.harvard.edu/~knill/teaching/math21b2004/exhibits/2dmatrices/index.html
            // After calculating the eigen-values and eigen-vectors, we calculate the basis for rendering the splat
            // by normalizing the eigen-vectors and then multiplying them by (sqrt(8) * sqrt(eigen-value)), which is
            // equal to scaling them by sqrt(8) standard deviations.
            //
            // This is a different approach than in the original work at INRIA. In that work they compute the
            // max extents of the projected splat in screen space to form a screen-space aligned bounding rectangle
            // which forms the geometry that is actually rasterized. The dimensions of that bounding box are 3.0
            // times the square root of the maximum eigen-value, or 3 standard deviations. They then use the inverse
            // 2D covariance matrix (called 'conic') in the CUDA rendering thread to determine fragment opacity by
            // calculating the full gaussian: exp(-0.5 * (X - mean) * conic * (X - mean)) * splat opacity
            float a = cov2Dv.x;
            float d = cov2Dv.z;
            float b = cov2Dv.y;
            float D = a * d - b * b;
            float trace = a + d;
            float traceOver2 = 0.5 * trace;
            float term2 = sqrt(max(0.1f, traceOver2 * traceOver2 - D));
            float eigenValue1 = traceOver2 + term2;
            float eigenValue2 = traceOver2 - term2;

            if (pointCloudModeEnabled == 1) {
                eigenValue1 = eigenValue2 = 0.2;
            }

            if (eigenValue2 <= 0.0) return;

            vec2 eigenVector1 = normalize(vec2(b, eigenValue1 - a));
            // since the eigen vectors are orthogonal, we derive the second one from the first
            vec2 eigenVector2 = vec2(eigenVector1.y, -eigenVector1.x);

            // We use sqrt(8) standard deviations instead of 3 to eliminate more of the splat with a very low opacity.
            vec2 basisVector1 = eigenVector1 * splatScale * min(sqrt8 * sqrt(eigenValue1), ${parseInt(n)}.0);
            vec2 basisVector2 = eigenVector2 * splatScale * min(sqrt8 * sqrt(eigenValue2), ${parseInt(n)}.0);
            `,t&&(r+=`
                vColor.a *= splatOpacityFromScene;
            `),r+=`
            vec2 ndcOffset = vec2(vPosition.x * basisVector1 + vPosition.y * basisVector2) *
                             basisViewport * 2.0 * inverseFocalAdjustment;

            vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);
            gl_Position = quadPos;

            // Scale the position data we send to the fragment shader
            vPosition *= sqrt8;
        `,r+=Hi.getVertexShaderFadeIn(),r+="}",r}static buildFragmentShader(){let e=`
            precision highp float;
            #include <common>
 
            uniform vec3 debugColor;

            varying vec4 vColor;
            varying vec2 vUv;
            varying vec2 vPosition;
        `;return e+=`
            void main () {
                // Compute the positional squared distance from the center of the splat to the current fragment.
                float A = dot(vPosition, vPosition);
                // Since the positional data in vPosition has been scaled by sqrt(8), the squared result will be
                // scaled by a factor of 8. If the squared result is larger than 8, it means it is outside the ellipse
                // defined by the rectangle formed by vPosition. It also means it's farther
                // away than sqrt(8) standard deviations from the mean.
                if (A > 8.0) discard;
                vec3 color = vColor.rgb;

                // Since the rendered splat is scaled by sqrt(8), the inverse covariance matrix that is part of
                // the gaussian formula becomes the identity matrix. We're then left with (X - mean) * (X - mean),
                // and since 'mean' is zero, we have X * X, which is the same as A:
                float opacity = exp(-0.5 * A) * vColor.a;

                gl_FragColor = vec4(color.rgb, opacity);
            }
        `,e}}class mr{static build(e=!1,t=!1,n=1,i=!1,r=0){let o=Hi.buildVertexShaderBase(e,t,r,`
            uniform vec2 scaleRotationsTextureSize;
            uniform highp sampler2D scaleRotationsTexture;
            varying mat3 vT;
            varying vec2 vQuadCenter;
            varying vec2 vFragCoord;
        `);o+=mr.buildVertexShaderProjection();const l=mr.buildFragmentShader(),c=Hi.getUniforms(e,t,r,n,i);return c.scaleRotationsTexture={type:"t",value:null},c.scaleRotationsTextureSize={type:"v2",value:new Me(1024,1024)},new jt({uniforms:c,vertexShader:o,fragmentShader:l,transparent:!0,alphaTest:1,blending:qn,depthTest:!0,depthWrite:!1,side:tn})}static buildVertexShaderProjection(){let e=`

            vec4 scaleRotationA = texture(scaleRotationsTexture, getDataUVF(nearestEvenIndex, 1.5,
                                                                            oddOffset, scaleRotationsTextureSize));
            vec4 scaleRotationB = texture(scaleRotationsTexture, getDataUVF(nearestEvenIndex, 1.5,
                                                                            oddOffset + uint(1), scaleRotationsTextureSize));

            vec3 scaleRotation123 = vec3(scaleRotationA.rgb) * (1.0 - fOddOffset) +
                                    vec3(scaleRotationA.ba, scaleRotationB.r) * fOddOffset;
            vec3 scaleRotation456 = vec3(scaleRotationA.a, scaleRotationB.rg) * (1.0 - fOddOffset) +
                                    vec3(scaleRotationB.gba) * fOddOffset;

            float missingW = sqrt(1.0 - scaleRotation456.x * scaleRotation456.x - scaleRotation456.y *
                                    scaleRotation456.y - scaleRotation456.z * scaleRotation456.z);
            mat3 R = quaternionToRotationMatrix(scaleRotation456.r, scaleRotation456.g, scaleRotation456.b, missingW);
            mat3 S = mat3(scaleRotation123.r, 0.0, 0.0,
                            0.0, scaleRotation123.g, 0.0,
                            0.0, 0.0, scaleRotation123.b);
            
            mat3 L = R * S;

            mat3x4 splat2World = mat3x4(vec4(L[0], 0.0),
                                        vec4(L[1], 0.0),
                                        vec4(splatCenter.x, splatCenter.y, splatCenter.z, 1.0));

            mat4 world2ndc = transpose(projectionMatrix * transformModelViewMatrix);

            mat3x4 ndc2pix = mat3x4(vec4(viewport.x / 2.0, 0.0, 0.0, (viewport.x - 1.0) / 2.0),
                                    vec4(0.0, viewport.y / 2.0, 0.0, (viewport.y - 1.0) / 2.0),
                                    vec4(0.0, 0.0, 0.0, 1.0));

            mat3 T = transpose(splat2World) * world2ndc * ndc2pix;
            vec3 normal = vec3(viewMatrix * vec4(L[0][2], L[1][2], L[2][2], 0.0));
        `;return e+=`

                mat4 splat2World4 = mat4(vec4(L[0], 0.0),
                                        vec4(L[1], 0.0),
                                        vec4(L[2], 0.0),
                                        vec4(splatCenter.x, splatCenter.y, splatCenter.z, 1.0));

                mat4 Tt = transpose(transpose(splat2World4) * world2ndc);

                vec4 tempPoint1 = Tt * vec4(1.0, 0.0, 0.0, 1.0);
                tempPoint1 /= tempPoint1.w;

                vec4 tempPoint2 = Tt * vec4(0.0, 1.0, 0.0, 1.0);
                tempPoint2 /= tempPoint2.w;

                vec4 center = Tt * vec4(0.0, 0.0, 0.0, 1.0);
                center /= center.w;

                vec2 basisVector1 = tempPoint1.xy - center.xy;
                vec2 basisVector2 = tempPoint2.xy - center.xy;

                vec2 basisVector1Screen = basisVector1 * 0.5 * viewport;
                vec2 basisVector2Screen = basisVector2 * 0.5 * viewport;

                const float minPix = 1.;
                if (length(basisVector1Screen) < minPix || length(basisVector2Screen) < minPix) {
                    
            vec3 T0 = vec3(T[0][0], T[0][1], T[0][2]);
            vec3 T1 = vec3(T[1][0], T[1][1], T[1][2]);
            vec3 T3 = vec3(T[2][0], T[2][1], T[2][2]);

            vec3 tempPoint = vec3(1.0, 1.0, -1.0);
            float distance = (T3.x * T3.x * tempPoint.x) + (T3.y * T3.y * tempPoint.y) + (T3.z * T3.z * tempPoint.z);
            vec3 f = (1.0 / distance) * tempPoint;
            if (abs(distance) < 0.00001) return;

            float pointImageX = (T0.x * T3.x * f.x) + (T0.y * T3.y * f.y) + (T0.z * T3.z * f.z);
            float pointImageY = (T1.x * T3.x * f.x) + (T1.y * T3.y * f.y) + (T1.z * T3.z * f.z);
            vec2 pointImage = vec2(pointImageX, pointImageY);

            float tempX = (T0.x * T0.x * f.x) + (T0.y * T0.y * f.y) + (T0.z * T0.z * f.z);
            float tempY = (T1.x * T1.x * f.x) + (T1.y * T1.y * f.y) + (T1.z * T1.z * f.z);
            vec2 temp = vec2(tempX, tempY);

            vec2 halfExtend = pointImage * pointImage - temp;
            vec2 extent = sqrt(max(vec2(0.0001), halfExtend));
            float radius = max(extent.x, extent.y);

            vec2 ndcOffset = ((position.xy * radius * 3.0) * basisViewport * 2.0);

            vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);
            gl_Position = quadPos;

            vT = T;
            vQuadCenter = pointImage;
            vFragCoord = (quadPos.xy * 0.5 + 0.5) * viewport;
        
                } else {
                    vec2 ndcOffset = vec2(position.x * basisVector1 + position.y * basisVector2) * 3.0 * inverseFocalAdjustment;
                    vec4 quadPos = vec4(ndcCenter.xy + ndcOffset, ndcCenter.z, 1.0);
                    gl_Position = quadPos;

                    vT = T;
                    vQuadCenter = center.xy;
                    vFragCoord = (quadPos.xy * 0.5 + 0.5) * viewport;
                }
            `,e+=Hi.getVertexShaderFadeIn(),e+="}",e}static buildFragmentShader(){return`
            precision highp float;
            #include <common>

            uniform vec3 debugColor;

            varying vec4 vColor;
            varying vec2 vUv;
            varying vec2 vPosition;
            varying mat3 vT;
            varying vec2 vQuadCenter;
            varying vec2 vFragCoord;

            void main () {

                const float FilterInvSquare = 2.0;
                const float near_n = 0.2;
                const float T = 1.0;

                vec2 xy = vQuadCenter;
                vec3 Tu = vT[0];
                vec3 Tv = vT[1];
                vec3 Tw = vT[2];
                vec3 k = vFragCoord.x * Tw - Tu;
                vec3 l = vFragCoord.y * Tw - Tv;
                vec3 p = cross(k, l);
                if (p.z == 0.0) discard;
                vec2 s = vec2(p.x / p.z, p.y / p.z);
                float rho3d = (s.x * s.x + s.y * s.y); 
                vec2 d = vec2(xy.x - vFragCoord.x, xy.y - vFragCoord.y);
                float rho2d = FilterInvSquare * (d.x * d.x + d.y * d.y); 

                // compute intersection and depth
                float rho = min(rho3d, rho2d);
                float depth = (rho3d <= rho2d) ? (s.x * Tw.x + s.y * Tw.y) + Tw.z : Tw.z; 
                if (depth < near_n) discard;
                //  vec4 nor_o = collected_normal_opacity[j];
                //  float normal[3] = {nor_o.x, nor_o.y, nor_o.z};
                float opa = vColor.a;

                float power = -0.5f * rho;
                if (power > 0.0f) discard;

                // Eq. (2) from 3D Gaussian splatting paper.
                // Obtain alpha by multiplying with Gaussian opacity
                // and its exponential falloff from mean.
                // Avoid numerical instabilities (see paper appendix). 
                float alpha = min(0.99f, opa * exp(power));
                if (alpha < 1.0f / 255.0f) discard;
                float test_T = T * (1.0 - alpha);
                if (test_T < 0.0001)discard;

                float w = alpha * T;
                gl_FragColor = vec4(vColor.rgb, w);
            }
        `}}class H0{static build(e){const t=new an;t.setIndex([0,1,2,0,2,3]);const n=new Float32Array(4*3),i=new rn(n,3);t.setAttribute("position",i),i.setXYZ(0,-1,-1,0),i.setXYZ(1,-1,1,0),i.setXYZ(2,1,1,0),i.setXYZ(3,1,-1,0),i.needsUpdate=!0;const r=new Rg().copy(t),a=new Uint32Array(e),o=new wg(a,1,!1);return o.setUsage(Qu),r.setAttribute("splatIndex",o),r.instanceCount=0,r}}class V0 extends Ct{constructor(e,t=new I,n=new ut,i=new I(1,1,1),r=1,a=1,o=!0){super(),this.splatBuffer=e,this.position.copy(t),this.quaternion.copy(n),this.scale.copy(i),this.transform=new ke,this.minimumAlpha=r,this.opacity=a,this.visible=o}copyTransformData(e){this.position.copy(e.position),this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.transform.copy(e.transform)}updateTransform(e){e?(this.matrixWorldAutoUpdate&&this.updateWorldMatrix(!0,!1),this.transform.copy(this.matrixWorld)):(this.matrixAutoUpdate&&this.updateMatrix(),this.transform.copy(this.matrix))}}const Ar=class Ar{constructor(e,t,n,i){this.min=new I().copy(e),this.max=new I().copy(t),this.boundingBox=new sn(this.min,this.max),this.center=new I().copy(this.max).sub(this.min).multiplyScalar(.5).add(this.min),this.depth=n,this.children=[],this.data=null,this.id=i||Ar.idGen++}};Z(Ar,"idGen",0);let io=Ar;class ds{constructor(e,t){this.maxDepth=e,this.maxCentersPerNode=t,this.sceneDimensions=new I,this.sceneMin=new I,this.sceneMax=new I,this.rootNode=null,this.nodesWithIndexes=[],this.splatMesh=null}static convertWorkerSubTreeNode(e){const t=new I().fromArray(e.min),n=new I().fromArray(e.max),i=new io(t,n,e.depth,e.id);if(e.data.indexes){i.data={indexes:[]};for(let r of e.data.indexes)i.data.indexes.push(r)}if(e.children)for(let r of e.children)i.children.push(ds.convertWorkerSubTreeNode(r));return i}static convertWorkerSubTree(e,t){const n=new ds(e.maxDepth,e.maxCentersPerNode);n.sceneMin=new I().fromArray(e.sceneMin),n.sceneMax=new I().fromArray(e.sceneMax),n.splatMesh=t,n.rootNode=ds.convertWorkerSubTreeNode(e.rootNode);const i=(r,a)=>{r.children.length===0&&a(r);for(let o of r.children)i(o,a)};return n.nodesWithIndexes=[],i(n.rootNode,r=>{r.data&&r.data.indexes&&r.data.indexes.length>0&&n.nodesWithIndexes.push(r)}),n}}function G0(s){let e=0;class t{constructor(l,c){this.min=[l[0],l[1],l[2]],this.max=[c[0],c[1],c[2]]}containsPoint(l){return l[0]>=this.min[0]&&l[0]<=this.max[0]&&l[1]>=this.min[1]&&l[1]<=this.max[1]&&l[2]>=this.min[2]&&l[2]<=this.max[2]}}class n{constructor(l,c){this.maxDepth=l,this.maxCentersPerNode=c,this.sceneDimensions=[],this.sceneMin=[],this.sceneMax=[],this.rootNode=null,this.addedIndexes={},this.nodesWithIndexes=[],this.splatMesh=null,this.disposed=!1}}class i{constructor(l,c,u,d){this.min=[l[0],l[1],l[2]],this.max=[c[0],c[1],c[2]],this.center=[(c[0]-l[0])*.5+l[0],(c[1]-l[1])*.5+l[1],(c[2]-l[2])*.5+l[2]],this.depth=u,this.children=[],this.data=null,this.id=d||e++}}processSplatTreeNode=function(o,l,c,u){const d=l.data.indexes.length;if(d<o.maxCentersPerNode||l.depth>o.maxDepth){const x=[];for(let v=0;v<l.data.indexes.length;v++)o.addedIndexes[l.data.indexes[v]]||(x.push(l.data.indexes[v]),o.addedIndexes[l.data.indexes[v]]=!0);l.data.indexes=x,l.data.indexes.sort((v,y)=>v>y?1:-1),o.nodesWithIndexes.push(l);return}const p=[l.max[0]-l.min[0],l.max[1]-l.min[1],l.max[2]-l.min[2]],h=[p[0]*.5,p[1]*.5,p[2]*.5],g=[l.min[0]+h[0],l.min[1]+h[1],l.min[2]+h[2]],A=[new t([g[0]-h[0],g[1],g[2]-h[2]],[g[0],g[1]+h[1],g[2]]),new t([g[0],g[1],g[2]-h[2]],[g[0]+h[0],g[1]+h[1],g[2]]),new t([g[0],g[1],g[2]],[g[0]+h[0],g[1]+h[1],g[2]+h[2]]),new t([g[0]-h[0],g[1],g[2]],[g[0],g[1]+h[1],g[2]+h[2]]),new t([g[0]-h[0],g[1]-h[1],g[2]-h[2]],[g[0],g[1],g[2]]),new t([g[0],g[1]-h[1],g[2]-h[2]],[g[0]+h[0],g[1],g[2]]),new t([g[0],g[1]-h[1],g[2]],[g[0]+h[0],g[1],g[2]+h[2]]),new t([g[0]-h[0],g[1]-h[1],g[2]],[g[0],g[1],g[2]+h[2]])],f=[];for(let x=0;x<A.length;x++)f[x]=[];const m=[0,0,0];for(let x=0;x<d;x++){const v=l.data.indexes[x],y=c[v];m[0]=u[y],m[1]=u[y+1],m[2]=u[y+2];for(let T=0;T<A.length;T++)A[T].containsPoint(m)&&f[T].push(v)}for(let x=0;x<A.length;x++){const v=new i(A[x].min,A[x].max,l.depth+1);v.data={indexes:f[x]},l.children.push(v)}l.data={};for(let x of l.children)processSplatTreeNode(o,x,c,u)};const r=(o,l,c)=>{const u=[0,0,0],d=[0,0,0],p=[],h=Math.floor(o.length/4);for(let A=0;A<h;A++){const f=A*4,m=o[f],x=o[f+1],v=o[f+2],y=Math.round(o[f+3]);(A===0||m<u[0])&&(u[0]=m),(A===0||m>d[0])&&(d[0]=m),(A===0||x<u[1])&&(u[1]=x),(A===0||x>d[1])&&(d[1]=x),(A===0||v<u[2])&&(u[2]=v),(A===0||v>d[2])&&(d[2]=v),p.push(y)}const g=new n(l,c);return g.sceneMin=u,g.sceneMax=d,g.rootNode=new i(g.sceneMin,g.sceneMax,0),g.rootNode.data={indexes:p},g};function a(o,l,c){const u=[];for(let p of o){const h=Math.floor(p.length/4);for(let g=0;g<h;g++){const A=g*4,f=Math.round(p[A+3]);u[f]=A}}const d=[];for(let p of o){const h=r(p,l,c);d.push(h),processSplatTreeNode(h,h.rootNode,u,p)}s.postMessage({subTrees:d})}s.onmessage=o=>{o.data.process&&a(o.data.process.centers,o.data.process.maxDepth,o.data.process.maxCentersPerNode)}}function W0(s,e,t,n,i){s.postMessage({process:{centers:e,maxDepth:n,maxCentersPerNode:i}},t)}function X0(){return new Worker(URL.createObjectURL(new Blob(["(",G0.toString(),")(self)"],{type:"application/javascript"})))}class q0{constructor(e,t){Z(this,"processSplatMesh",function(e,t=()=>!0,n,i){this.splatTreeWorker||(this.splatTreeWorker=X0()),this.splatMesh=e,this.subTrees=[];const r=new I,a=(o,l)=>{const c=new Float32Array(l*4);let u=0;for(let d=0;d<l;d++){const p=d+o;if(t(p)){e.getSplatCenter(p,r);const h=u*4;c[h]=r.x,c[h+1]=r.y,c[h+2]=r.z,c[h+3]=p,u++}}return c};return new Promise(o=>{const l=()=>this.disposed?(this.diposeSplatTreeWorker(),o(),!0):!1;n&&n(!1),Yt(()=>{if(l())return;const c=[];if(e.dynamicMode){let u=0;for(let d=0;d<e.scenes.length;d++){const h=e.getScene(d).splatBuffer.getSplatCount(),g=a(u,h);c.push(g),u+=h}}else{const u=a(0,e.getSplatCount());c.push(u)}this.splatTreeWorker.onmessage=u=>{l()||u.data.subTrees&&(i&&i(!1),Yt(()=>{if(!l()){for(let d of u.data.subTrees){const p=ds.convertWorkerSubTree(d,e);this.subTrees.push(p)}this.diposeSplatTreeWorker(),i&&i(!0),Yt(()=>{o()})}}))},Yt(()=>{if(l())return;n&&n(!0);const u=c.map(d=>d.buffer);W0(this.splatTreeWorker,c,u,this.maxDepth,this.maxCentersPerNode)})})})});this.maxDepth=e,this.maxCentersPerNode=t,this.subTrees=[],this.splatMesh=null}dispose(){this.diposeSplatTreeWorker(),this.disposed=!0}diposeSplatTreeWorker(){this.splatTreeWorker&&this.splatTreeWorker.terminate(),this.splatTreeWorker=null}countLeaves(){let e=0;return this.visitLeaves(()=>{e++}),e}visitLeaves(e){const t=(n,i)=>{n.children.length===0&&i(n);for(let r of n.children)t(r,i)};for(let n of this.subTrees)t(n.rootNode,e)}}function Q0(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Y0(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(_){if(_==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),A=s.getParameter(s.MAX_VERTEX_ATTRIBS),f=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),m=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),v=p>0,y=a||e.has("OES_texture_float"),T=v&&y,E=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:h,maxCubemapSize:g,maxAttributes:A,maxVertexUniforms:f,maxVaryings:m,maxFragmentUniforms:x,vertexTextures:v,floatFragmentTextures:y,floatVertexTextures:T,maxSamples:E}}const hs={Default:0,Instant:2},Vi={None:0,Info:3},ac=new an,K0=new hi,$s=6,j0=4,Z0=4,$0=4,J0=6,eA=8,da=4,ha=4,oc=1,tA=.012,nA=.003,lc=1,cc=16777216;class Rt extends St{constructor(t=wn.ThreeD,n=!1,i=!1,r=!1,a=1,o=!0,l=!1,c=!1,u=1024,d=Vi.None,p=0,h=1,g=.3){super(ac,K0);Z(this,"buildSplatTree",function(t=[],n,i){return new Promise(r=>{this.disposeSplatTree(),this.baseSplatTree=new q0(8,1e3);const a=performance.now(),o=new ft;this.baseSplatTree.processSplatMesh(this,l=>{this.getSplatColor(l,o);const c=this.getSceneIndexForSplat(l),u=t[c]||1;return o.w>=u},n,i).then(()=>{const l=performance.now()-a;if(this.logLevel>=Vi.Info&&console.log("SplatTree build: "+l+" ms"),this.disposed)r();else{this.splatTree=this.baseSplatTree,this.baseSplatTree=null;let c=0,u=0,d=0;this.splatTree.visitLeaves(p=>{const h=p.data.indexes.length;h>0&&(u+=h,d++,c++)}),this.logLevel>=Vi.Info&&(console.log(`SplatTree leaves: ${this.splatTree.countLeaves()}`),console.log(`SplatTree leaves with splats:${c}`),u=u/d,console.log(`Avg splat count per node: ${u}`),console.log(`Total splat count: ${this.getSplatCount()}`)),r()}})})});Z(this,"updateUniforms",function(){const t=new Me;return function(n,i,r,a,o,l){if(this.getSplatCount()>0){if(t.set(n.x*this.devicePixelRatio,n.y*this.devicePixelRatio),this.material.uniforms.viewport.value.copy(t),this.material.uniforms.basisViewport.value.set(1/t.x,1/t.y),this.material.uniforms.focal.value.set(i,r),this.material.uniforms.orthographicMode.value=a?1:0,this.material.uniforms.orthoZoom.value=o,this.material.uniforms.inverseFocalAdjustment.value=l,this.dynamicMode)for(let u=0;u<this.scenes.length;u++)this.material.uniforms.transforms.value[u].copy(this.getScene(u).transform);if(this.enableOptionalEffects)for(let u=0;u<this.scenes.length;u++)this.material.uniforms.sceneOpacity.value[u]=ht(this.getScene(u).opacity,0,1),this.material.uniforms.sceneVisibility.value[u]=this.getScene(u).visible?1:0,this.material.uniformsNeedUpdate=!0;this.material.uniformsNeedUpdate=!0}}}());Z(this,"setupDistancesComputationTransformFeedback",function(){let t;return function(){const n=this.getMaxSplatCount();if(!this.renderer)return;const i=this.lastRenderer!==this.renderer,r=t!==n;if(!i&&!r)return;i?this.disposeDistancesComputationGPUResources():r&&this.disposeDistancesComputationGPUBufferResources();const a=this.renderer.getContext(),o=(h,g,A)=>{const f=h.createShader(g);if(!f)return console.error("Fatal error: gl could not create a shader object."),null;if(h.shaderSource(f,A),h.compileShader(f),!h.getShaderParameter(f,h.COMPILE_STATUS)){let x="unknown";g===h.VERTEX_SHADER?x="vertex shader":g===h.FRAGMENT_SHADER&&(x="fragement shader");const v=h.getShaderInfoLog(f);return console.error("Failed to compile "+x+" with these errors:"+v),h.deleteShader(f),null}return f};let l;this.integerBasedDistancesComputation?(l=`#version 300 es
                in ivec4 center;
                flat out int distance;`,this.dynamicMode?l+=`
                        in uint sceneIndex;
                        uniform ivec4 transforms[${Qe.MaxScenes}];
                        void main(void) {
                            ivec4 transform = transforms[sceneIndex];
                            distance = center.x * transform.x + center.y * transform.y + center.z * transform.z + transform.w * center.w;
                        }
                    `:l+=`
                        uniform ivec3 modelViewProj;
                        void main(void) {
                            distance = center.x * modelViewProj.x + center.y * modelViewProj.y + center.z * modelViewProj.z;
                        }
                    `):(l=`#version 300 es
                in vec4 center;
                flat out float distance;`,this.dynamicMode?l+=`
                        in uint sceneIndex;
                        uniform mat4 transforms[${Qe.MaxScenes}];
                        void main(void) {
                            vec4 transformedCenter = transforms[sceneIndex] * vec4(center.xyz, 1.0);
                            distance = transformedCenter.z;
                        }
                    `:l+=`
                        uniform vec3 modelViewProj;
                        void main(void) {
                            distance = center.x * modelViewProj.x + center.y * modelViewProj.y + center.z * modelViewProj.z;
                        }
                    `);const c=`#version 300 es
                precision lowp float;
                out vec4 fragColor;
                void main(){}
            `,u=a.getParameter(a.VERTEX_ARRAY_BINDING),d=a.getParameter(a.CURRENT_PROGRAM),p=d?a.getProgramParameter(d,a.DELETE_STATUS):!1;if(i&&(this.distancesTransformFeedback.vao=a.createVertexArray()),a.bindVertexArray(this.distancesTransformFeedback.vao),i){const h=a.createProgram(),g=o(a,a.VERTEX_SHADER,l),A=o(a,a.FRAGMENT_SHADER,c);if(!g||!A)throw new Error("Could not compile shaders for distances computation on GPU.");if(a.attachShader(h,g),a.attachShader(h,A),a.transformFeedbackVaryings(h,["distance"],a.SEPARATE_ATTRIBS),a.linkProgram(h),!a.getProgramParameter(h,a.LINK_STATUS)){const m=a.getProgramInfoLog(h);throw console.error("Fatal error: Failed to link program: "+m),a.deleteProgram(h),a.deleteShader(A),a.deleteShader(g),new Error("Could not link shaders for distances computation on GPU.")}this.distancesTransformFeedback.program=h,this.distancesTransformFeedback.vertexShader=g,this.distancesTransformFeedback.vertexShader=A}if(a.useProgram(this.distancesTransformFeedback.program),this.distancesTransformFeedback.centersLoc=a.getAttribLocation(this.distancesTransformFeedback.program,"center"),this.dynamicMode){this.distancesTransformFeedback.sceneIndexesLoc=a.getAttribLocation(this.distancesTransformFeedback.program,"sceneIndex");for(let h=0;h<this.scenes.length;h++)this.distancesTransformFeedback.transformsLocs[h]=a.getUniformLocation(this.distancesTransformFeedback.program,`transforms[${h}]`)}else this.distancesTransformFeedback.modelViewProjLoc=a.getUniformLocation(this.distancesTransformFeedback.program,"modelViewProj");(i||r)&&(this.distancesTransformFeedback.centersBuffer=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,this.distancesTransformFeedback.centersBuffer),a.enableVertexAttribArray(this.distancesTransformFeedback.centersLoc),this.integerBasedDistancesComputation?a.vertexAttribIPointer(this.distancesTransformFeedback.centersLoc,4,a.INT,0,0):a.vertexAttribPointer(this.distancesTransformFeedback.centersLoc,4,a.FLOAT,!1,0,0),this.dynamicMode&&(this.distancesTransformFeedback.sceneIndexesBuffer=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,this.distancesTransformFeedback.sceneIndexesBuffer),a.enableVertexAttribArray(this.distancesTransformFeedback.sceneIndexesLoc),a.vertexAttribIPointer(this.distancesTransformFeedback.sceneIndexesLoc,1,a.UNSIGNED_INT,0,0))),(i||r)&&(this.distancesTransformFeedback.outDistancesBuffer=a.createBuffer()),a.bindBuffer(a.ARRAY_BUFFER,this.distancesTransformFeedback.outDistancesBuffer),a.bufferData(a.ARRAY_BUFFER,n*4,a.STATIC_READ),i&&(this.distancesTransformFeedback.id=a.createTransformFeedback()),a.bindTransformFeedback(a.TRANSFORM_FEEDBACK,this.distancesTransformFeedback.id),a.bindBufferBase(a.TRANSFORM_FEEDBACK_BUFFER,0,this.distancesTransformFeedback.outDistancesBuffer),d&&p!==!0&&a.useProgram(d),u&&a.bindVertexArray(u),this.lastRenderer=this.renderer,t=n}}());Z(this,"fillTransformsArray",function(){const t=[];return function(n){t.length!==n.length&&(t.length=n.length);for(let i=0;i<this.scenes.length;i++){const a=this.getScene(i).transform.elements;for(let o=0;o<16;o++)t[i*16+o]=a[o]}n.set(t)}}());Z(this,"computeDistancesOnGPU",function(){const t=new ke;return function(n,i){if(!this.renderer)return;const r=this.renderer.getContext(),a=r.getParameter(r.VERTEX_ARRAY_BINDING),o=r.getParameter(r.CURRENT_PROGRAM),l=o?r.getProgramParameter(o,r.DELETE_STATUS):!1;if(r.bindVertexArray(this.distancesTransformFeedback.vao),r.useProgram(this.distancesTransformFeedback.program),r.enable(r.RASTERIZER_DISCARD),this.dynamicMode)for(let d=0;d<this.scenes.length;d++)if(t.copy(this.getScene(d).transform),t.premultiply(n),this.integerBasedDistancesComputation){const p=Rt.getIntegerMatrixArray(t),h=[p[2],p[6],p[10],p[14]];r.uniform4i(this.distancesTransformFeedback.transformsLocs[d],h[0],h[1],h[2],h[3])}else r.uniformMatrix4fv(this.distancesTransformFeedback.transformsLocs[d],!1,t.elements);else if(this.integerBasedDistancesComputation){const d=Rt.getIntegerMatrixArray(n),p=[d[2],d[6],d[10]];r.uniform3i(this.distancesTransformFeedback.modelViewProjLoc,p[0],p[1],p[2])}else{const d=[n.elements[2],n.elements[6],n.elements[10]];r.uniform3f(this.distancesTransformFeedback.modelViewProjLoc,d[0],d[1],d[2])}r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.centersBuffer),r.enableVertexAttribArray(this.distancesTransformFeedback.centersLoc),this.integerBasedDistancesComputation?r.vertexAttribIPointer(this.distancesTransformFeedback.centersLoc,4,r.INT,0,0):r.vertexAttribPointer(this.distancesTransformFeedback.centersLoc,4,r.FLOAT,!1,0,0),this.dynamicMode&&(r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.sceneIndexesBuffer),r.enableVertexAttribArray(this.distancesTransformFeedback.sceneIndexesLoc),r.vertexAttribIPointer(this.distancesTransformFeedback.sceneIndexesLoc,1,r.UNSIGNED_INT,0,0)),r.bindTransformFeedback(r.TRANSFORM_FEEDBACK,this.distancesTransformFeedback.id),r.bindBufferBase(r.TRANSFORM_FEEDBACK_BUFFER,0,this.distancesTransformFeedback.outDistancesBuffer),r.beginTransformFeedback(r.POINTS),r.drawArrays(r.POINTS,0,this.getSplatCount()),r.endTransformFeedback(),r.bindBufferBase(r.TRANSFORM_FEEDBACK_BUFFER,0,null),r.bindTransformFeedback(r.TRANSFORM_FEEDBACK,null),r.disable(r.RASTERIZER_DISCARD);const c=r.fenceSync(r.SYNC_GPU_COMMANDS_COMPLETE,0);r.flush();const u=new Promise(d=>{const p=()=>{if(this.disposed)d();else switch(r.clientWaitSync(c,0,0)){case r.TIMEOUT_EXPIRED:return this.computeDistancesOnGPUSyncTimeout=setTimeout(p),this.computeDistancesOnGPUSyncTimeout;case r.WAIT_FAILED:throw new Error("should never get here");default:this.computeDistancesOnGPUSyncTimeout=null,r.deleteSync(c);const f=r.getParameter(r.VERTEX_ARRAY_BINDING);r.bindVertexArray(this.distancesTransformFeedback.vao),r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.outDistancesBuffer),r.getBufferSubData(r.ARRAY_BUFFER,0,i),r.bindBuffer(r.ARRAY_BUFFER,null),f&&r.bindVertexArray(f),d()}};this.computeDistancesOnGPUSyncTimeout=setTimeout(p)});return o&&l!==!0&&r.useProgram(o),a&&r.bindVertexArray(a),u}}());Z(this,"getSplatCenter",function(){const t={};return function(n,i,r){this.getLocalSplatParameters(n,t,r),t.splatBuffer.getSplatCenter(t.localIndex,i,t.sceneTransform)}}());Z(this,"getSplatScaleAndRotation",function(){const t={},n=new I;return function(i,r,a,o){this.getLocalSplatParameters(i,t,o),n.x=void 0,n.y=void 0,n.z=void 0,this.splatRenderMode===wn.TwoD&&(n.z=0),t.splatBuffer.getSplatScaleAndRotation(t.localIndex,r,a,t.sceneTransform,n)}}());Z(this,"getSplatColor",function(){const t={};return function(n,i){this.getLocalSplatParameters(n,t),t.splatBuffer.getSplatColor(t.localIndex,i)}}());this.renderer=void 0,this.splatRenderMode=t,this.dynamicMode=n,this.enableOptionalEffects=i,this.halfPrecisionCovariancesOnGPU=r,this.devicePixelRatio=a,this.enableDistancesComputationOnGPU=o,this.integerBasedDistancesComputation=l,this.antialiased=c,this.kernel2DSize=g,this.maxScreenSpaceSplatSize=u,this.logLevel=d,this.sphericalHarmonicsDegree=p,this.minSphericalHarmonicsDegree=0,this.sceneFadeInRateMultiplier=h,this.scenes=[],this.splatTree=null,this.baseSplatTree=null,this.splatDataTextures={},this.distancesTransformFeedback={id:null,vertexShader:null,fragmentShader:null,program:null,centersBuffer:null,sceneIndexesBuffer:null,outDistancesBuffer:null,centersLoc:-1,modelViewProjLoc:-1,sceneIndexesLoc:-1,transformsLocs:[]},this.globalSplatIndexToLocalSplatIndexMap=[],this.globalSplatIndexToSceneIndexMap=[],this.lastBuildSplatCount=0,this.lastBuildScenes=[],this.lastBuildMaxSplatCount=0,this.lastBuildSceneCount=0,this.firstRenderTime=-1,this.finalBuild=!1,this.webGLUtils=null,this.boundingBox=new sn,this.calculatedSceneCenter=new I,this.maxSplatDistanceFromSceneCenter=0,this.visibleRegionBufferRadius=0,this.visibleRegionRadius=0,this.visibleRegionFadeStartRadius=0,this.visibleRegionChanging=!1,this.splatScale=1,this.pointCloudModeEnabled=!1,this.disposed=!1,this.lastRenderer=null,this.visible=!1}static buildScenes(t,n,i){const r=[];r.length=n.length;for(let a=0;a<n.length;a++){const o=n[a],l=i[a]||{};let c=l.position||[0,0,0],u=l.rotation||[0,0,0,1],d=l.scale||[1,1,1];const p=new I().fromArray(c),h=new ut().fromArray(u),g=new I().fromArray(d),A=Rt.createScene(o,p,h,g,l.splatAlphaRemovalThreshold||1,l.opacity,l.visible);t.add(A),r[a]=A}return r}static createScene(t,n,i,r,a,o=1,l=!0){return new V0(t,n,i,r,a,o,l)}static buildSplatIndexMaps(t){const n=[],i=[];let r=0;for(let a=0;a<t.length;a++){const l=t[a].getMaxSplatCount();for(let c=0;c<l;c++)n[r]=c,i[r]=a,r++}return{localSplatIndexMap:n,sceneIndexMap:i}}build(t,n,i=!0,r=!1,a,o,l=!0){this.sceneOptions=n,this.finalBuild=r;const c=Rt.getTotalMaxSplatCountForSplatBuffers(t),u=Rt.buildScenes(this,t,n);if(i)for(let f=0;f<this.scenes.length&&f<u.length;f++){const m=u[f],x=this.getScene(f);m.copyTransformData(x)}this.scenes=u;let d=3;for(let f of t){const m=f.getMinSphericalHarmonicsDegree();m<d&&(d=m)}this.minSphericalHarmonicsDegree=Math.min(d,this.sphericalHarmonicsDegree);let p=!1;if(t.length!==this.lastBuildScenes.length)p=!0;else for(let f=0;f<t.length;f++)if(t[f]!==this.lastBuildScenes[f].splatBuffer){p=!0;break}let h=!0;if((this.scenes.length!==1||this.lastBuildSceneCount!==this.scenes.length||this.lastBuildMaxSplatCount!==c||p)&&(h=!1),!h){this.boundingBox=new sn,l||(this.maxSplatDistanceFromSceneCenter=0,this.visibleRegionBufferRadius=0,this.visibleRegionRadius=0,this.visibleRegionFadeStartRadius=0,this.firstRenderTime=-1),this.lastBuildScenes=[],this.lastBuildSplatCount=0,this.lastBuildMaxSplatCount=0,this.disposeMeshData(),this.geometry=H0.build(c),this.splatRenderMode===wn.ThreeD?this.material=pr.build(this.dynamicMode,this.enableOptionalEffects,this.antialiased,this.maxScreenSpaceSplatSize,this.splatScale,this.pointCloudModeEnabled,this.minSphericalHarmonicsDegree,this.kernel2DSize):this.material=mr.build(this.dynamicMode,this.enableOptionalEffects,this.splatScale,this.pointCloudModeEnabled,this.minSphericalHarmonicsDegree);const f=Rt.buildSplatIndexMaps(t);this.globalSplatIndexToLocalSplatIndexMap=f.localSplatIndexMap,this.globalSplatIndexToSceneIndexMap=f.sceneIndexMap}const g=this.getSplatCount(!0);this.enableDistancesComputationOnGPU&&this.setupDistancesComputationTransformFeedback();const A=this.refreshGPUDataFromSplatBuffers(h);for(let f=0;f<this.scenes.length;f++)this.lastBuildScenes[f]=this.scenes[f];return this.lastBuildSplatCount=g,this.lastBuildMaxSplatCount=this.getMaxSplatCount(),this.lastBuildSceneCount=this.scenes.length,r&&this.scenes.length>0&&this.buildSplatTree(n.map(f=>f.splatAlphaRemovalThreshold||1),a,o).then(()=>{this.onSplatTreeReadyCallback&&this.onSplatTreeReadyCallback(this.splatTree),this.onSplatTreeReadyCallback=null}),this.visible=this.scenes.length>0,A}freeIntermediateSplatData(){const t=n=>{delete n.source.data,delete n.image,n.onUpdate=null};delete this.splatDataTextures.baseData.covariances,delete this.splatDataTextures.baseData.centers,delete this.splatDataTextures.baseData.colors,delete this.splatDataTextures.baseData.sphericalHarmonics,delete this.splatDataTextures.centerColors.data,delete this.splatDataTextures.covariances.data,this.splatDataTextures.sphericalHarmonics&&delete this.splatDataTextures.sphericalHarmonics.data,this.splatDataTextures.sceneIndexes&&delete this.splatDataTextures.sceneIndexes.data,this.splatDataTextures.centerColors.texture.needsUpdate=!0,this.splatDataTextures.centerColors.texture.onUpdate=()=>{t(this.splatDataTextures.centerColors.texture)},this.splatDataTextures.covariances.texture.needsUpdate=!0,this.splatDataTextures.covariances.texture.onUpdate=()=>{t(this.splatDataTextures.covariances.texture)},this.splatDataTextures.sphericalHarmonics&&(this.splatDataTextures.sphericalHarmonics.texture?(this.splatDataTextures.sphericalHarmonics.texture.needsUpdate=!0,this.splatDataTextures.sphericalHarmonics.texture.onUpdate=()=>{t(this.splatDataTextures.sphericalHarmonics.texture)}):this.splatDataTextures.sphericalHarmonics.textures.forEach(n=>{n.needsUpdate=!0,n.onUpdate=()=>{t(n)}})),this.splatDataTextures.sceneIndexes&&(this.splatDataTextures.sceneIndexes.texture.needsUpdate=!0,this.splatDataTextures.sceneIndexes.texture.onUpdate=()=>{t(this.splatDataTextures.sceneIndexes.texture)})}dispose(){this.disposeMeshData(),this.disposeTextures(),this.disposeSplatTree(),this.enableDistancesComputationOnGPU&&(this.computeDistancesOnGPUSyncTimeout&&(clearTimeout(this.computeDistancesOnGPUSyncTimeout),this.computeDistancesOnGPUSyncTimeout=null),this.disposeDistancesComputationGPUResources()),this.scenes=[],this.distancesTransformFeedback={id:null,vertexShader:null,fragmentShader:null,program:null,centersBuffer:null,sceneIndexesBuffer:null,outDistancesBuffer:null,centersLoc:-1,modelViewProjLoc:-1,sceneIndexesLoc:-1,transformsLocs:[]},this.renderer=null,this.globalSplatIndexToLocalSplatIndexMap=[],this.globalSplatIndexToSceneIndexMap=[],this.lastBuildSplatCount=0,this.lastBuildScenes=[],this.lastBuildMaxSplatCount=0,this.lastBuildSceneCount=0,this.firstRenderTime=-1,this.finalBuild=!1,this.webGLUtils=null,this.boundingBox=new sn,this.calculatedSceneCenter=new I,this.maxSplatDistanceFromSceneCenter=0,this.visibleRegionBufferRadius=0,this.visibleRegionRadius=0,this.visibleRegionFadeStartRadius=0,this.visibleRegionChanging=!1,this.splatScale=1,this.pointCloudModeEnabled=!1,this.disposed=!0,this.lastRenderer=null,this.visible=!1}disposeMeshData(){this.geometry&&this.geometry!==ac&&(this.geometry.dispose(),this.geometry=null),this.material&&(this.material.dispose(),this.material=null)}disposeTextures(){for(let t in this.splatDataTextures)if(this.splatDataTextures.hasOwnProperty(t)){const n=this.splatDataTextures[t];n.texture&&(n.texture.dispose(),n.texture=null)}this.splatDataTextures=null}disposeSplatTree(){this.splatTree&&(this.splatTree.dispose(),this.splatTree=null),this.baseSplatTree&&(this.baseSplatTree.dispose(),this.baseSplatTree=null)}getSplatTree(){return this.splatTree}onSplatTreeReady(t){this.onSplatTreeReadyCallback=t}getDataForDistancesComputation(t,n){const i=this.integerBasedDistancesComputation?this.getIntegerCenters(t,n,!0):this.getFloatCenters(t,n,!0),r=this.getSceneIndexes(t,n);return{centers:i,sceneIndexes:r}}refreshGPUDataFromSplatBuffers(t){const n=this.getSplatCount(!0);this.refreshDataTexturesFromSplatBuffers(t);const i=t?this.lastBuildSplatCount:0,{centers:r,sceneIndexes:a}=this.getDataForDistancesComputation(i,n-1);return this.enableDistancesComputationOnGPU&&this.refreshGPUBuffersForDistancesComputation(r,a,t),{from:i,to:n-1,count:n-i,centers:r,sceneIndexes:a}}refreshGPUBuffersForDistancesComputation(t,n,i=!1){const r=i?this.lastBuildSplatCount:0;this.updateGPUCentersBufferForDistancesComputation(i,t,r),this.updateGPUTransformIndexesBufferForDistancesComputation(i,n,r)}refreshDataTexturesFromSplatBuffers(t){const n=this.getSplatCount(!0),i=this.lastBuildSplatCount,r=n-1;t?this.updateBaseDataFromSplatBuffers(i,r):(this.setupDataTextures(),this.updateBaseDataFromSplatBuffers()),this.updateDataTexturesFromBaseData(i,r),this.updateVisibleRegion(t)}setupDataTextures(){const t=this.getMaxSplatCount(),n=this.getSplatCount(!0);this.disposeTextures();const i=(w,O)=>{const S=new Me(4096,1024);for(;S.x*S.y*w<t*O;)S.y*=2;return S},r=w=>w>=1?J0:Z0,a=w=>{const O=r(w),S=i(O,6);return{elementsPerTexelStored:O,texSize:S}};let o=this.getTargetCovarianceCompressionLevel();const l=0,c=this.getTargetSphericalHarmonicsCompressionLevel();let u,d,p;if(this.splatRenderMode===wn.ThreeD){const w=a(o);w.texSize.x*w.texSize.y>cc&&o===0&&(o=1),u=new Float32Array(t*$s)}else d=new Float32Array(t*3),p=new Float32Array(t*4);const h=new Float32Array(t*3),g=new Uint8Array(t*4);let A=Float32Array;c===1?A=Uint16Array:c===2&&(A=Uint8Array);const f=ki(this.minSphericalHarmonicsDegree),m=this.minSphericalHarmonicsDegree?new A(t*f):void 0,x=i(ha,4),v=new Uint32Array(x.x*x.y*ha);Rt.updateCenterColorsPaddedData(0,n-1,h,g,v);const y=new kn(v,x.x,x.y,Ni,nn);if(y.internalFormat="RGBA32UI",y.needsUpdate=!0,this.material.uniforms.centersColorsTexture.value=y,this.material.uniforms.centersColorsTextureSize.value.copy(x),this.material.uniformsNeedUpdate=!0,this.splatDataTextures={baseData:{covariances:u,scales:d,rotations:p,centers:h,colors:g,sphericalHarmonics:m},centerColors:{data:v,texture:y,size:x}},this.splatRenderMode===wn.ThreeD){const w=a(o),O=w.elementsPerTexelStored,S=w.texSize;let M=o>=1?Uint32Array:Float32Array;const F=o>=1?eA:$0,P=new M(S.x*S.y*F);o===0?P.set(u):Rt.updatePaddedCompressedCovariancesTextureData(u,P,0,0,u.length);let D;if(o>=1)D=new kn(P,S.x,S.y,Ni,nn),D.internalFormat="RGBA32UI",this.material.uniforms.covariancesTextureHalfFloat.value=D;else{D=new kn(P,S.x,S.y,Ot,fn),this.material.uniforms.covariancesTexture.value=D;const z=new kn(new Uint32Array(32),2,2,Ni,nn);z.internalFormat="RGBA32UI",this.material.uniforms.covariancesTextureHalfFloat.value=z,z.needsUpdate=!0}D.needsUpdate=!0,this.material.uniforms.covariancesAreHalfFloat.value=o>=1?1:0,this.material.uniforms.covariancesTextureSize.value.copy(S),this.splatDataTextures.covariances={data:P,texture:D,size:S,compressionLevel:o,elementsPerTexelStored:O,elementsPerTexelAllocated:F}}else{const O=i(da,6);let S=Float32Array,M=fn;const F=new S(O.x*O.y*da);Rt.updateScaleRotationsPaddedData(0,n-1,d,p,F);const P=new kn(F,O.x,O.y,Ot,M);P.needsUpdate=!0,this.material.uniforms.scaleRotationsTexture.value=P,this.material.uniforms.scaleRotationsTextureSize.value.copy(O),this.splatDataTextures.scaleRotations={data:F,texture:P,size:O,compressionLevel:l}}if(m){const w=c===2?Sn:Zi;let O=f;O%2!==0&&O++;const S=4,M=Ot;let F=i(S,O);if(F.x*F.y<=cc){const P=F.x*F.y*S,D=new A(P);for(let U=0;U<n;U++){const G=f*U,H=O*U;for(let Y=0;Y<f;Y++)D[H+Y]=m[G+Y]}const z=new kn(D,F.x,F.y,M,w);z.needsUpdate=!0,this.material.uniforms.sphericalHarmonicsTexture.value=z,this.splatDataTextures.sphericalHarmonics={componentCount:f,paddedComponentCount:O,data:D,textureCount:1,texture:z,size:F,compressionLevel:c,elementsPerTexel:S}}else{const P=f/3;O=P,O%2!==0&&O++,F=i(S,O);const D=F.x*F.y*S,z=[this.material.uniforms.sphericalHarmonicsTextureR,this.material.uniforms.sphericalHarmonicsTextureG,this.material.uniforms.sphericalHarmonicsTextureB],U=[],G=[];for(let H=0;H<3;H++){const Y=new A(D);U.push(Y);for(let le=0;le<n;le++){const Be=f*le,Re=O*le;if(P>=3){for(let X=0;X<3;X++)Y[Re+X]=m[Be+H*3+X];if(P>=8)for(let X=0;X<5;X++)Y[Re+3+X]=m[Be+9+H*5+X]}}const ne=new kn(Y,F.x,F.y,M,w);G.push(ne),ne.needsUpdate=!0,z[H].value=ne}this.material.uniforms.sphericalHarmonicsMultiTextureMode.value=1,this.splatDataTextures.sphericalHarmonics={componentCount:f,componentCountPerChannel:P,paddedComponentCount:O,data:U,textureCount:3,textures:G,size:F,compressionLevel:c,elementsPerTexel:S}}this.material.uniforms.sphericalHarmonicsTextureSize.value.copy(F),this.material.uniforms.sphericalHarmonics8BitMode.value=c===2?1:0;for(let P=0;P<this.scenes.length;P++){const D=this.scenes[P].splatBuffer;this.material.uniforms.sphericalHarmonics8BitCompressionRangeMin.value[P]=D.minSphericalHarmonicsCoeff,this.material.uniforms.sphericalHarmonics8BitCompressionRangeMax.value[P]=D.maxSphericalHarmonicsCoeff}this.material.uniformsNeedUpdate=!0}const T=i(oc,4),E=new Uint32Array(T.x*T.y*oc);for(let w=0;w<n;w++)E[w]=this.globalSplatIndexToSceneIndexMap[w];const _=new kn(E,T.x,T.y,xr,nn);_.internalFormat="R32UI",_.needsUpdate=!0,this.material.uniforms.sceneIndexesTexture.value=_,this.material.uniforms.sceneIndexesTextureSize.value.copy(T),this.material.uniformsNeedUpdate=!0,this.splatDataTextures.sceneIndexes={data:E,texture:_,size:T},this.material.uniforms.sceneCount.value=this.scenes.length}updateBaseDataFromSplatBuffers(t,n){const i=this.splatDataTextures.covariances,r=i?i.compressionLevel:void 0,a=this.splatDataTextures.scaleRotations,o=a?a.compressionLevel:void 0,l=this.splatDataTextures.sphericalHarmonics,c=l?l.compressionLevel:0;this.fillSplatDataArrays(this.splatDataTextures.baseData.covariances,this.splatDataTextures.baseData.scales,this.splatDataTextures.baseData.rotations,this.splatDataTextures.baseData.centers,this.splatDataTextures.baseData.colors,this.splatDataTextures.baseData.sphericalHarmonics,void 0,r,o,c,t,n,t)}updateDataTexturesFromBaseData(t,n){const i=this.splatDataTextures.covariances,r=i?i.compressionLevel:void 0,a=this.splatDataTextures.scaleRotations,o=a?a.compressionLevel:void 0,l=this.splatDataTextures.sphericalHarmonics,c=l?l.compressionLevel:0,u=this.splatDataTextures.centerColors,d=u.data,p=u.texture;Rt.updateCenterColorsPaddedData(t,n,this.splatDataTextures.baseData.centers,this.splatDataTextures.baseData.colors,d);const h=this.renderer?this.renderer.properties.get(p):null;if(!h||!h.__webglTexture?p.needsUpdate=!0:this.updateDataTexture(d,u.texture,u.size,h,ha,j0,4,t,n),i){const v=i.texture,y=t*$s,T=n*$s;if(r===0)for(let _=y;_<=T;_++){const w=this.splatDataTextures.baseData.covariances[_];i.data[_]=w}else Rt.updatePaddedCompressedCovariancesTextureData(this.splatDataTextures.baseData.covariances,i.data,t*i.elementsPerTexelAllocated,y,T);const E=this.renderer?this.renderer.properties.get(v):null;!E||!E.__webglTexture?v.needsUpdate=!0:r===0?this.updateDataTexture(i.data,i.texture,i.size,E,i.elementsPerTexelStored,$s,4,t,n):this.updateDataTexture(i.data,i.texture,i.size,E,i.elementsPerTexelAllocated,i.elementsPerTexelAllocated,2,t,n)}if(a){const v=a.data,y=a.texture,T=6,E=o===0?4:2;Rt.updateScaleRotationsPaddedData(t,n,this.splatDataTextures.baseData.scales,this.splatDataTextures.baseData.rotations,v);const _=this.renderer?this.renderer.properties.get(y):null;!_||!_.__webglTexture?y.needsUpdate=!0:this.updateDataTexture(v,a.texture,a.size,_,da,T,E,t,n)}const g=this.splatDataTextures.baseData.sphericalHarmonics;if(g){let v=4;c===1?v=2:c===2&&(v=1);const y=(_,w,O,S,M)=>{const F=this.renderer?this.renderer.properties.get(_):null;!F||!F.__webglTexture?_.needsUpdate=!0:this.updateDataTexture(S,_,w,F,O,M,v,t,n)},T=l.componentCount,E=l.paddedComponentCount;if(l.textureCount===1){const _=l.data;for(let w=t;w<=n;w++){const O=T*w,S=E*w;for(let M=0;M<T;M++)_[S+M]=g[O+M]}y(l.texture,l.size,l.elementsPerTexel,_,E)}else{const _=l.componentCountPerChannel;for(let w=0;w<3;w++){const O=l.data[w];for(let S=t;S<=n;S++){const M=T*S,F=E*S;if(_>=3){for(let P=0;P<3;P++)O[F+P]=g[M+w*3+P];if(_>=8)for(let P=0;P<5;P++)O[F+3+P]=g[M+9+w*5+P]}}y(l.textures[w],l.size,l.elementsPerTexel,O,E)}}}const A=this.splatDataTextures.sceneIndexes,f=A.data;for(let v=this.lastBuildSplatCount;v<=n;v++)f[v]=this.globalSplatIndexToSceneIndexMap[v];const m=A.texture,x=this.renderer?this.renderer.properties.get(m):null;!x||!x.__webglTexture?m.needsUpdate=!0:this.updateDataTexture(f,A.texture,A.size,x,1,1,1,this.lastBuildSplatCount,n)}getTargetCovarianceCompressionLevel(){return this.halfPrecisionCovariancesOnGPU?1:0}getTargetSphericalHarmonicsCompressionLevel(){return Math.max(1,this.getMaximumSplatBufferCompressionLevel())}getMaximumSplatBufferCompressionLevel(){let t;for(let n=0;n<this.scenes.length;n++){const r=this.getScene(n).splatBuffer;(n===0||r.compressionLevel>t)&&(t=r.compressionLevel)}return t}getMinimumSplatBufferCompressionLevel(){let t;for(let n=0;n<this.scenes.length;n++){const r=this.getScene(n).splatBuffer;(n===0||r.compressionLevel<t)&&(t=r.compressionLevel)}return t}static computeTextureUpdateRegion(t,n,i,r,a){const o=a/r,l=t*o,c=Math.floor(l/i),u=c*i*r,d=n*o,p=Math.floor(d/i),h=p*i*r+i*r;return{dataStart:u,dataEnd:h,startRow:c,endRow:p}}updateDataTexture(t,n,i,r,a,o,l,c,u){const d=this.renderer.getContext(),p=Rt.computeTextureUpdateRegion(c,u,i.x,a,o),h=p.dataEnd-p.dataStart,g=new t.constructor(t.buffer,p.dataStart*l,h),A=p.endRow-p.startRow+1,f=this.webGLUtils.convert(n.type),m=this.webGLUtils.convert(n.format,n.colorSpace),x=d.getParameter(d.TEXTURE_BINDING_2D);d.bindTexture(d.TEXTURE_2D,r.__webglTexture),d.texSubImage2D(d.TEXTURE_2D,0,0,p.startRow,i.x,A,m,f,g),d.bindTexture(d.TEXTURE_2D,x)}static updatePaddedCompressedCovariancesTextureData(t,n,i,r,a){let o=new DataView(n.buffer),l=i,c=0;for(let u=r;u<=a;u+=2)o.setUint16(l*2,t[u],!0),o.setUint16(l*2+2,t[u+1],!0),l+=2,c++,c>=3&&(l+=2,c=0)}static updateCenterColorsPaddedData(t,n,i,r,a){for(let o=t;o<=n;o++){const l=o*4,c=o*3,u=o*4;a[u]=Fg(r,l),a[u+1]=sa(i[c]),a[u+2]=sa(i[c+1]),a[u+3]=sa(i[c+2])}}static updateScaleRotationsPaddedData(t,n,i,r,a){for(let l=t;l<=n;l++){const c=l*3,u=l*4,d=l*6;a[d]=i[c],a[d+1]=i[c+1],a[d+2]=i[c+2],a[d+3]=r[u],a[d+4]=r[u+1],a[d+5]=r[u+2]}}updateVisibleRegion(t){const n=this.getSplatCount(!0),i=new I;if(!t){const a=new I;this.scenes.forEach(o=>{a.add(o.splatBuffer.sceneCenter)}),a.multiplyScalar(1/this.scenes.length),this.calculatedSceneCenter.copy(a),this.material.uniforms.sceneCenter.value.copy(this.calculatedSceneCenter),this.material.uniformsNeedUpdate=!0}const r=t?this.lastBuildSplatCount:0;for(let a=r;a<n;a++){this.getSplatCenter(a,i,!0);const o=i.sub(this.calculatedSceneCenter).length();o>this.maxSplatDistanceFromSceneCenter&&(this.maxSplatDistanceFromSceneCenter=o)}this.maxSplatDistanceFromSceneCenter-this.visibleRegionBufferRadius>lc&&(this.visibleRegionBufferRadius=this.maxSplatDistanceFromSceneCenter,this.visibleRegionRadius=Math.max(this.visibleRegionBufferRadius-lc,0)),this.finalBuild&&(this.visibleRegionRadius=this.visibleRegionBufferRadius=this.maxSplatDistanceFromSceneCenter),this.updateVisibleRegionFadeDistance()}updateVisibleRegionFadeDistance(t=hs.Default){const n=tA*this.sceneFadeInRateMultiplier,i=nA*this.sceneFadeInRateMultiplier,r=this.finalBuild?n:i,a=t===hs.Default?r:i;this.visibleRegionFadeStartRadius=(this.visibleRegionRadius-this.visibleRegionFadeStartRadius)*a+this.visibleRegionFadeStartRadius;const l=(this.visibleRegionBufferRadius>0?this.visibleRegionFadeStartRadius/this.visibleRegionBufferRadius:0)>.99,c=l||t===hs.Instant?1:0;this.material.uniforms.visibleRegionFadeStartRadius.value=this.visibleRegionFadeStartRadius,this.material.uniforms.visibleRegionRadius.value=this.visibleRegionRadius,this.material.uniforms.firstRenderTime.value=this.firstRenderTime,this.material.uniforms.currentTime.value=performance.now(),this.material.uniforms.fadeInComplete.value=c,this.material.uniformsNeedUpdate=!0,this.visibleRegionChanging=!l}updateRenderIndexes(t,n){const i=this.geometry;i.attributes.splatIndex.set(t),i.attributes.splatIndex.needsUpdate=!0,n>0&&this.firstRenderTime===-1&&(this.firstRenderTime=performance.now()),i.instanceCount=n,i.setDrawRange(0,n)}updateTransforms(){for(let t=0;t<this.scenes.length;t++)this.getScene(t).updateTransform(this.dynamicMode)}setSplatScale(t=1){this.splatScale=t,this.material.uniforms.splatScale.value=t,this.material.uniformsNeedUpdate=!0}getSplatScale(){return this.splatScale}setPointCloudModeEnabled(t){this.pointCloudModeEnabled=t,this.material.uniforms.pointCloudModeEnabled.value=t?1:0,this.material.uniformsNeedUpdate=!0}getPointCloudModeEnabled(){return this.pointCloudModeEnabled}getSplatDataTextures(){return this.splatDataTextures}getSplatCount(t=!1){return t?Rt.getTotalSplatCountForScenes(this.scenes):this.lastBuildSplatCount}static getTotalSplatCountForScenes(t){let n=0;for(let i of t)i&&i.splatBuffer&&(n+=i.splatBuffer.getSplatCount());return n}static getTotalSplatCountForSplatBuffers(t){let n=0;for(let i of t)n+=i.getSplatCount();return n}getMaxSplatCount(){return Rt.getTotalMaxSplatCountForScenes(this.scenes)}static getTotalMaxSplatCountForScenes(t){let n=0;for(let i of t)i&&i.splatBuffer&&(n+=i.splatBuffer.getMaxSplatCount());return n}static getTotalMaxSplatCountForSplatBuffers(t){let n=0;for(let i of t)n+=i.getMaxSplatCount();return n}disposeDistancesComputationGPUResources(){if(!this.renderer)return;const t=this.renderer.getContext();this.distancesTransformFeedback.vao&&(t.deleteVertexArray(this.distancesTransformFeedback.vao),this.distancesTransformFeedback.vao=null),this.distancesTransformFeedback.program&&(t.deleteProgram(this.distancesTransformFeedback.program),t.deleteShader(this.distancesTransformFeedback.vertexShader),t.deleteShader(this.distancesTransformFeedback.fragmentShader),this.distancesTransformFeedback.program=null,this.distancesTransformFeedback.vertexShader=null,this.distancesTransformFeedback.fragmentShader=null),this.disposeDistancesComputationGPUBufferResources(),this.distancesTransformFeedback.id&&(t.deleteTransformFeedback(this.distancesTransformFeedback.id),this.distancesTransformFeedback.id=null)}disposeDistancesComputationGPUBufferResources(){if(!this.renderer)return;const t=this.renderer.getContext();this.distancesTransformFeedback.centersBuffer&&(this.distancesTransformFeedback.centersBuffer=null,t.deleteBuffer(this.distancesTransformFeedback.centersBuffer)),this.distancesTransformFeedback.outDistancesBuffer&&(t.deleteBuffer(this.distancesTransformFeedback.outDistancesBuffer),this.distancesTransformFeedback.outDistancesBuffer=null)}setRenderer(t){if(t!==this.renderer){this.renderer=t;const n=this.renderer.getContext(),i=new Q0(n),r=new Y0(n,i,{});if(i.init(r),this.webGLUtils=new Wc(n,i),this.enableDistancesComputationOnGPU&&this.getSplatCount()>0){this.setupDistancesComputationTransformFeedback();const{centers:a,sceneIndexes:o}=this.getDataForDistancesComputation(0,this.getSplatCount()-1);this.refreshGPUBuffersForDistancesComputation(a,o)}}}updateGPUCentersBufferForDistancesComputation(t,n,i){if(!this.renderer)return;const r=this.renderer.getContext(),a=r.getParameter(r.VERTEX_ARRAY_BINDING);r.bindVertexArray(this.distancesTransformFeedback.vao);const o=this.integerBasedDistancesComputation?Uint32Array:Float32Array,l=16,c=i*l;if(r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.centersBuffer),t)r.bufferSubData(r.ARRAY_BUFFER,c,n);else{const u=new o(this.getMaxSplatCount()*l);u.set(n),r.bufferData(r.ARRAY_BUFFER,u,r.STATIC_DRAW)}r.bindBuffer(r.ARRAY_BUFFER,null),a&&r.bindVertexArray(a)}updateGPUTransformIndexesBufferForDistancesComputation(t,n,i){if(!this.renderer||!this.dynamicMode)return;const r=this.renderer.getContext(),a=r.getParameter(r.VERTEX_ARRAY_BINDING);r.bindVertexArray(this.distancesTransformFeedback.vao);const o=i*4;if(r.bindBuffer(r.ARRAY_BUFFER,this.distancesTransformFeedback.sceneIndexesBuffer),t)r.bufferSubData(r.ARRAY_BUFFER,o,n);else{const l=new Uint32Array(this.getMaxSplatCount()*4);l.set(n),r.bufferData(r.ARRAY_BUFFER,l,r.STATIC_DRAW)}r.bindBuffer(r.ARRAY_BUFFER,null),a&&r.bindVertexArray(a)}getSceneIndexes(t,n){let i;const r=n-t+1;i=new Uint32Array(r);for(let a=t;a<=n;a++)i[a]=this.globalSplatIndexToSceneIndexMap[a];return i}getLocalSplatParameters(t,n,i){i==null&&(i=!this.dynamicMode),n.splatBuffer=this.getSplatBufferForSplat(t),n.localIndex=this.getSplatLocalIndex(t),n.sceneTransform=i?this.getSceneTransformForSplat(t):null}fillSplatDataArrays(t,n,i,r,a,o,l,c=0,u=0,d=1,p,h,g=0,A){const f=new I;f.x=void 0,f.y=void 0,this.splatRenderMode===wn.ThreeD?f.z=void 0:f.z=1;const m=new ke;let x=0,v=this.scenes.length-1;A!=null&&A>=0&&A<=this.scenes.length&&(x=A,v=A);for(let y=x;y<=v;y++){l==null&&(l=!this.dynamicMode);const T=this.getScene(y),E=T.splatBuffer;let _;if(l&&(this.getSceneTransform(y,m),_=m),t&&E.fillSplatCovarianceArray(t,_,p,h,g,c),n||i){if(!n||!i)throw new Error('SplatMesh::fillSplatDataArrays() -> "scales" and "rotations" must both be valid.');E.fillSplatScaleRotationArray(n,i,_,p,h,g,u,f)}r&&E.fillSplatCenterArray(r,_,p,h,g),a&&E.fillSplatColorArray(a,T.minimumAlpha,p,h,g),o&&E.fillSphericalHarmonicsArray(o,this.minSphericalHarmonicsDegree,_,p,h,g,d),g+=E.getSplatCount()}}getIntegerCenters(t,n,i=!1){const r=n-t+1,a=new Float32Array(r*3);this.fillSplatDataArrays(null,null,null,a,null,null,void 0,void 0,void 0,void 0,t);let o,l=i?4:3;o=new Int32Array(r*l);for(let c=0;c<r;c++){for(let u=0;u<3;u++)o[c*l+u]=Math.round(a[c*3+u]*1e3);i&&(o[c*l+3]=1e3)}return o}getFloatCenters(t,n,i=!1){const r=n-t+1,a=new Float32Array(r*3);if(this.fillSplatDataArrays(null,null,null,a,null,null,void 0,void 0,void 0,void 0,t),!i)return a;let o=new Float32Array(r*4);for(let l=0;l<r;l++){for(let c=0;c<3;c++)o[l*4+c]=a[l*3+c];o[l*4+3]=1}return o}getSceneTransform(t,n){const i=this.getScene(t);i.updateTransform(this.dynamicMode),n.copy(i.transform)}getScene(t){if(t<0||t>=this.scenes.length)throw new Error("SplatMesh::getScene() -> Invalid scene index.");return this.scenes[t]}getSceneCount(){return this.scenes.length}getSplatBufferForSplat(t){return this.getScene(this.globalSplatIndexToSceneIndexMap[t]).splatBuffer}getSceneIndexForSplat(t){return this.globalSplatIndexToSceneIndexMap[t]}getSceneTransformForSplat(t){return this.getScene(this.globalSplatIndexToSceneIndexMap[t]).transform}getSplatLocalIndex(t){return this.globalSplatIndexToLocalSplatIndexMap[t]}static getIntegerMatrixArray(t){const n=t.elements,i=[];for(let r=0;r<16;r++)i[r]=Math.round(n[r]*1e3);return i}computeBoundingBox(t=!1,n){let i=this.getSplatCount();if(n!=null){if(n<0||n>=this.scenes.length)throw new Error("SplatMesh::computeBoundingBox() -> Invalid scene index.");i=this.scenes[n].splatBuffer.getSplatCount()}const r=new Float32Array(i*3);this.fillSplatDataArrays(null,null,null,r,null,null,t,void 0,void 0,void 0,void 0,n);const a=new I,o=new I;for(let l=0;l<i;l++){const c=l*3,u=r[c],d=r[c+1],p=r[c+2];(l===0||u<a.x)&&(a.x=u),(l===0||d<a.y)&&(a.y=d),(l===0||p<a.z)&&(a.z=p),(l===0||u>o.x)&&(o.x=u),(l===0||d>o.y)&&(o.y=d),(l===0||p>o.z)&&(o.z=p)}return new sn(a,o)}}var iA="AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEbA2AAAGAQf39/f39/f39/f39/f39/fwBgAAF/AhIBA2VudgZtZW1vcnkCAwCAgAQDBAMAAQIHVAQRX193YXNtX2NhbGxfY3RvcnMAABhfX3dhc21fYXBwbHlfZGF0YV9yZWxvY3MAAAtzb3J0SW5kZXhlcwABE2Vtc2NyaXB0ZW5fdGxzX2luaXQAAgqWEAMDAAELihAEAXwDewN/A30gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEBA0AgAyABQQJ0IgVqIAIgACAFaigCAEECdGooAgAiBTYCACAFIAogBSAKSBshCiAFIA0gBSANShshDSABQQFqIgEgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiFWooAgAiFkECdGooAgAiFEcEQAJ/IAX9CQI4IAggFEEGdGoiDv0JAgwgDioCHP0gASAOKgIs/SACIA4qAjz9IAP95gEgBf0JAiggDv0JAgggDioCGP0gASAOKgIo/SACIA4qAjj9IAP95gEgBf0JAgggDv0JAgAgDioCEP0gASAOKgIg/SACIA4qAjD9IAP95gEgBf0JAhggDv0JAgQgDioCFP0gASAOKgIk/SACIA4qAjT9IAP95gH95AH95AH95AEiEf1f/QwAAAAAAECPQAAAAAAAQI9AIhL98gEiE/0hASIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDgJ/IBP9IQAiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgL/REgDv0cAQJ/IBEgEf0NCAkKCwwNDg8AAAAAAAAAAP1fIBL98gEiEf0hACIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAv9HAICfyAR/SEBIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4C/0cAyESIBQhDwsgAyAVaiABIBZBBHRq/QAAACAS/bUBIhH9GwAgEf0bAWogEf0bAmogEf0bA2oiDjYCACAOIAogCiAOShshCiAOIA0gDSAOSBshDSACQQFqIgIgC0cNAAsMAwsCfyAFKgIIu/0UIAUqAhi7/SIB/QwAAAAAAECPQAAAAAAAQI9A/fIBIhH9IQEiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIQ4CfyAR/SEAIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyECAn8gBSoCKLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEFQfj///8HIQpBiICAgHghDSALIAxNDQIgAv0RIA79HAEgBf0cAiESIAwhBQNAIAMgBUECdCICaiABIAAgAmooAgBBBHRq/QAAACAS/bUBIhH9GwAgEf0bAWogEf0bAmoiAjYCACACIAogAiAKSBshCiACIA0gAiANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEBA0AgAyABQQJ0IgVqAn8gAiAAIAVqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAFBAWoiASALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIRcgBSoCGCEYIAUqAgghGUH4////ByEKQYiAgIB4IQ0gDCEFA0ACfyAXIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCAZIAIqAgCUIBggAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIUaigCAEECdCIVaigCACIORwRAIAX9CQI4IAggDkEGdGoiD/0JAgwgDyoCHP0gASAPKgIs/SACIA8qAjz9IAP95gEgBf0JAiggD/0JAgggDyoCGP0gASAPKgIo/SACIA8qAjj9IAP95gEgBf0JAgggD/0JAgAgDyoCEP0gASAPKgIg/SACIA8qAjD9IAP95gEgBf0JAhggD/0JAgQgDyoCFP0gASAPKgIk/SACIA8qAjT9IAP95gH95AH95AH95AEhESAOIQ8LIAMgFGoCfyAR/R8DIAEgFUECdCIOQQxyaioCAJQgEf0fAiABIA5BCHJqKgIAlCAR/R8AIAEgDmoqAgCUIBH9HwEgASAOQQRyaioCAJSSkpK7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAsiDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSACQQFqIgIgC0cNAAsMAQtBiICAgHghDUH4////ByEKCyALIAxLBEAgCUEBa7MgDbIgCrKTlSEXIAwhDQNAAn8gFyADIA1BAnRqIgEoAgAgCmuylCIYi0MAAABPXQRAIBioDAELQYCAgIB4CyEOIAEgDjYCACAEIA5BAnRqIgEgASgCAEEBajYCACANQQFqIg0gC0cNAAsLIAlBAk8EQCAEKAIAIQ1BASEKA0AgBCAKQQJ0aiIBIAEoAgAgDWoiDTYCACAKQQFqIgogCUcNAAsLIAxBAEoEQCAMIQoDQCAGIApBAWsiAUECdCICaiAAIAJqKAIANgIAIApBAUshAiABIQogAg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCwsEAEEACw==",uc="AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACEgEDZW52Bm1lbW9yeQIDAICABAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQqiDwICAAucDwMBfAd9Bn8gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEFA0AgAyAFQQJ0IgFqIAIgACABaigCAEECdGooAgAiATYCACABIAogASAKSBshCiABIA0gASANShshDSAFQQFqIgUgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiGmooAgBBAnQiG2ooAgAiDkcEQAJ/IAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRgCfyARIA8qAiyUIBIgDyoCKJQgEyAPKgIglCAUIA8qAiSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRkCfyARIA8qAhyUIBIgDyoCGJQgEyAPKgIQlCAUIA8qAhSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRwCfyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIR0gDiEPCyADIBpqIAEgG0ECdGoiDigCBCAcbCAOKAIAIB1saiAOKAIIIBlsaiAOKAIMIBhsaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAii7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshAgJ/IAUqAhi7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshByALIAxNAn8gBSoCCLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEPQfj///8HIQpBiICAgHghDQ0CIAwhBQNAIAMgBUECdCIIaiABIAAgCGooAgBBBHRqIggoAgQgB2wgCCgCACAPbGogCCgCCCACbGoiCDYCACAIIAogCCAKSBshCiAIIA0gCCANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEFA0AgAyAFQQJ0IgFqAn8gAiAAIAFqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAVBAWoiBSALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIREgBSoCGCESIAUqAgghE0H4////ByEKQYiAgIB4IQ0gDCEFA0ACfyARIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCATIAIqAgCUIBIgAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIYaigCAEECdCIZaigCACIORwRAIAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSIRUgESAPKgIslCASIA8qAiiUIBMgDyoCIJQgFCAPKgIklJKSkiEWIBEgDyoCHJQgEiAPKgIYlCATIA8qAhCUIBQgDyoCFJSSkpIhFyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSIREgDiEPCyADIBhqAn8gFSABIBlBAnRqIg4qAgyUIBYgDioCCJQgESAOKgIAlCAXIA4qAgSUkpKSu0QAAAAAAACwQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIg42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gAkEBaiICIAtHDQALDAELQYiAgIB4IQ1B+P///wchCgsgCyAMSwRAIAlBAWuzIA2yIAqyk5UhESAMIQ0DQAJ/IBEgAyANQQJ0aiIBKAIAIAprspQiEotDAAAAT10EQCASqAwBC0GAgICAeAshDiABIA42AgAgBCAOQQJ0aiIBIAEoAgBBAWo2AgAgDUEBaiINIAtHDQALCyAJQQJPBEAgBCgCACENQQEhCgNAIAQgCkECdGoiASABKAIAIA1qIg02AgAgCkEBaiIKIAlHDQALCyAMQQBKBEAgDCEKA0AgBiAKQQFrIgFBAnQiAmogACACaigCADYCACAKQQFLIAEhCg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCws=",sA="AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACDwEDZW52Bm1lbW9yeQIAAAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQrrDwICAAvlDwQBfAN7B30DfyALIAprIQwCQAJAIA4EQCANBEBB+P///wchCkGIgICAeCENIAsgDE0NAyAMIQUDQCADIAVBAnQiAWogAiAAIAFqKAIAQQJ0aigCACIBNgIAIAEgCiABIApIGyEKIAEgDSABIA1KGyENIAVBAWoiBSALRw0ACwwDCyAPBEAgCyAMTQ0CQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIcaigCACIdQQJ0aigCACIbRwRAAn8gBf0JAjggCCAbQQZ0aiIO/QkCDCAOKgIc/SABIA4qAiz9IAIgDioCPP0gA/3mASAF/QkCKCAO/QkCCCAOKgIY/SABIA4qAij9IAIgDioCOP0gA/3mASAF/QkCCCAO/QkCACAOKgIQ/SABIA4qAiD9IAIgDioCMP0gA/3mASAF/QkCGCAO/QkCBCAOKgIU/SABIA4qAiT9IAIgDioCNP0gA/3mAf3kAf3kAf3kASIR/V/9DAAAAAAAQI9AAAAAAABAj0AiEv3yASIT/SEBIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOAn8gE/0hACIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAv9ESAO/RwBAn8gESAR/Q0ICQoLDA0ODwABAgMAAQID/V8gEv3yASIR/SEAIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4C/0cAgJ/IBH9IQEiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgL/RwDIRIgGyEPCyADIBxqIAEgHUEEdGr9AAAAIBL9tQEiEf0bACAR/RsBaiAR/RsCaiAR/RsDaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAgi7/RQgBSoCGLv9IgH9DAAAAAAAQI9AAAAAAABAj0D98gEiEf0hASIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDgJ/IBH9IQAiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLAn8gBSoCKLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEFQfj///8HIQpBiICAgHghDSALIAxNDQL9ESAO/RwBIAX9HAIhEiAMIQUDQCADIAVBAnQiAmogASAAIAJqKAIAQQR0av0AAAAgEv21ASIR/RsAIBH9GwFqIBH9GwJqIgI2AgAgAiAKIAIgCkgbIQogAiANIAIgDUobIQ0gBUEBaiIFIAtHDQALDAILIA0EQEH4////ByEKQYiAgIB4IQ0gCyAMTQ0CIAwhBQNAIAMgBUECdCIBagJ/IAIgACABaigCAEECdGoqAgC7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAsiDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgD0UEQCALIAxNDQEgBSoCKCEUIAUqAhghFSAFKgIIIRZB+P///wchCkGIgICAeCENIAwhBQNAAn8gFCABIAAgBUECdCIHaigCAEEEdGoiAioCCJQgFiACKgIAlCAVIAIqAgSUkpK7RAAAAAAAALBAoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshDiADIAdqIA42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gBUEBaiIFIAtHDQALDAILIAsgDE0NAEF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiG2ooAgBBAnQiHGooAgAiDkcEQCAFKgI4IhQgCCAOQQZ0aiIPKgI8lCAFKgIoIhUgDyoCOJQgBSoCCCIWIA8qAjCUIAUqAhgiFyAPKgI0lJKSkiEYIBQgDyoCLJQgFSAPKgIolCAWIA8qAiCUIBcgDyoCJJSSkpIhGSAUIA8qAhyUIBUgDyoCGJQgFiAPKgIQlCAXIA8qAhSUkpKSIRogFCAPKgIMlCAVIA8qAgiUIBYgDyoCAJQgFyAPKgIElJKSkiEUIA4hDwsgAyAbagJ/IBggASAcQQJ0aiIOKgIMlCAZIA4qAgiUIBQgDioCAJQgGiAOKgIElJKSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAJBAWoiAiALRw0ACwwBC0GIgICAeCENQfj///8HIQoLIAsgDEsEQCAJQQFrsyANsiAKspOVIRQgDCENA0ACfyAUIAMgDUECdGoiASgCACAKa7KUIhWLQwAAAE9dBEAgFagMAQtBgICAgHgLIQ4gASAONgIAIAQgDkECdGoiASABKAIAQQFqNgIAIA1BAWoiDSALRw0ACwsgCUECTwRAIAQoAgAhDUEBIQoDQCAEIApBAnRqIgEgASgCACANaiINNgIAIApBAWoiCiAJRw0ACwsgDEEASgRAIAwhCgNAIAYgCkEBayIBQQJ0IgJqIAAgAmooAgA2AgAgCkEBSyABIQoNAAsLIAsgDEoEQCALIQoDQCAGIAsgBCADIApBAWsiCkECdCIBaigCAEECdGoiAigCACIFa0ECdGogACABaigCADYCACACIAVBAWs2AgAgCiAMSg0ACwsL",rA="AGFzbQEAAAAADwhkeWxpbmsuMAEEAAAAAAEXAmAAAGAQf39/f39/f39/f39/f39/fwACDwEDZW52Bm1lbW9yeQIAAAMDAgABBz4DEV9fd2FzbV9jYWxsX2N0b3JzAAAYX193YXNtX2FwcGx5X2RhdGFfcmVsb2NzAAALc29ydEluZGV4ZXMAAQqiDwICAAucDwMBfAd9Bn8gCyAKayEMAkACQCAOBEAgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQMgDCEFA0AgAyAFQQJ0IgFqIAIgACABaigCAEECdGooAgAiATYCACABIAogASAKSBshCiABIA0gASANShshDSAFQQFqIgUgC0cNAAsMAwsgDwRAIAsgDE0NAkF/IQ9B+P///wchCkGIgICAeCENIAwhAgNAIA8gByAAIAJBAnQiGmooAgBBAnQiG2ooAgAiDkcEQAJ/IAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRgCfyARIA8qAiyUIBIgDyoCKJQgEyAPKgIglCAUIA8qAiSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRkCfyARIA8qAhyUIBIgDyoCGJQgEyAPKgIQlCAUIA8qAhSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIRwCfyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSu0QAAAAAAECPQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIR0gDiEPCyADIBpqIAEgG0ECdGoiDigCBCAcbCAOKAIAIB1saiAOKAIIIBlsaiAOKAIMIBhsaiIONgIAIA4gCiAKIA5KGyEKIA4gDSANIA5IGyENIAJBAWoiAiALRw0ACwwDCwJ/IAUqAii7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshAgJ/IAUqAhi7RAAAAAAAQI9AoiIQmUQAAAAAAADgQWMEQCAQqgwBC0GAgICAeAshByALIAxNAn8gBSoCCLtEAAAAAABAj0CiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEPQfj///8HIQpBiICAgHghDQ0CIAwhBQNAIAMgBUECdCIIaiABIAAgCGooAgBBBHRqIggoAgQgB2wgCCgCACAPbGogCCgCCCACbGoiCDYCACAIIAogCCAKSBshCiAIIA0gCCANShshDSAFQQFqIgUgC0cNAAsMAgsgDQRAQfj///8HIQpBiICAgHghDSALIAxNDQIgDCEFA0AgAyAFQQJ0IgFqAn8gAiAAIAFqKAIAQQJ0aioCALtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyIONgIAIAogDiAKIA5IGyEKIA0gDiANIA5KGyENIAVBAWoiBSALRw0ACwwCCyAPRQRAIAsgDE0NASAFKgIoIREgBSoCGCESIAUqAgghE0H4////ByEKQYiAgIB4IQ0gDCEFA0ACfyARIAEgACAFQQJ0IgdqKAIAQQR0aiICKgIIlCATIAIqAgCUIBIgAioCBJSSkrtEAAAAAAAAsECiIhCZRAAAAAAAAOBBYwRAIBCqDAELQYCAgIB4CyEOIAMgB2ogDjYCACAKIA4gCiAOSBshCiANIA4gDSAOShshDSAFQQFqIgUgC0cNAAsMAgsgCyAMTQ0AQX8hD0H4////ByEKQYiAgIB4IQ0gDCECA0AgDyAHIAAgAkECdCIYaigCAEECdCIZaigCACIORwRAIAUqAjgiESAIIA5BBnRqIg8qAjyUIAUqAigiEiAPKgI4lCAFKgIIIhMgDyoCMJQgBSoCGCIUIA8qAjSUkpKSIRUgESAPKgIslCASIA8qAiiUIBMgDyoCIJQgFCAPKgIklJKSkiEWIBEgDyoCHJQgEiAPKgIYlCATIA8qAhCUIBQgDyoCFJSSkpIhFyARIA8qAgyUIBIgDyoCCJQgEyAPKgIAlCAUIA8qAgSUkpKSIREgDiEPCyADIBhqAn8gFSABIBlBAnRqIg4qAgyUIBYgDioCCJQgESAOKgIAlCAXIA4qAgSUkpKSu0QAAAAAAACwQKIiEJlEAAAAAAAA4EFjBEAgEKoMAQtBgICAgHgLIg42AgAgCiAOIAogDkgbIQogDSAOIA0gDkobIQ0gAkEBaiICIAtHDQALDAELQYiAgIB4IQ1B+P///wchCgsgCyAMSwRAIAlBAWuzIA2yIAqyk5UhESAMIQ0DQAJ/IBEgAyANQQJ0aiIBKAIAIAprspQiEotDAAAAT10EQCASqAwBC0GAgICAeAshDiABIA42AgAgBCAOQQJ0aiIBIAEoAgBBAWo2AgAgDUEBaiINIAtHDQALCyAJQQJPBEAgBCgCACENQQEhCgNAIAQgCkECdGoiASABKAIAIA1qIg02AgAgCkEBaiIKIAlHDQALCyAMQQBKBEAgDCEKA0AgBiAKQQFrIgFBAnQiAmogACACaigCADYCACAKQQFLIAEhCg0ACwsgCyAMSgRAIAshCgNAIAYgCyAEIAMgCkEBayIKQQJ0IgFqKAIAQQJ0aiICKAIAIgVrQQJ0aiAAIAFqKAIANgIAIAIgBUEBazYCACAKIAxKDQALCws=";function aA(s){let e,t,n,i,r,a,o,l,c,u,d,p,h,g,A,f,m,x,v,y;function T(E,_,w,O,S,M,F){const P=performance.now();if(!n&&(new Uint32Array(t,o,S.byteLength/y.BytesPerInt).set(S),new Float32Array(t,u,F.byteLength/y.BytesPerFloat).set(F),O)){let H;i?H=new Int32Array(t,d,M.byteLength/y.BytesPerInt):H=new Float32Array(t,d,M.byteLength/y.BytesPerFloat),H.set(M)}f||(f=new Uint32Array(x)),new Float32Array(t,A,16).set(w),new Uint32Array(t,h,x).set(f),e.exports.sortIndexes(o,g,d,p,h,A,l,c,u,x,E,_,a,O,i,r);const D={sortDone:!0,splatSortCount:E,splatRenderCount:_,sortTime:0};if(!n){const U=new Uint32Array(t,l,_);(!m||m.length<_)&&(m=new Uint32Array(_)),m.set(U),D.sortedIndexes=m}const z=performance.now();D.sortTime=z-P,s.postMessage(D)}s.onmessage=E=>{if(E.data.centers)centers=E.data.centers,sceneIndexes=E.data.sceneIndexes,i?new Int32Array(t,g+E.data.range.from*y.BytesPerInt*4,E.data.range.count*4).set(new Int32Array(centers)):new Float32Array(t,g+E.data.range.from*y.BytesPerFloat*4,E.data.range.count*4).set(new Float32Array(centers)),r&&new Uint32Array(t,c+E.data.range.from*4,E.data.range.count).set(new Uint32Array(sceneIndexes)),v=E.data.range.from+E.data.range.count;else if(E.data.sort){const _=Math.min(E.data.sort.splatRenderCount||0,v),w=Math.min(E.data.sort.splatSortCount||0,v),O=E.data.sort.usePrecomputedDistances;let S,M,F;n||(S=E.data.sort.indexesToSort,F=E.data.sort.transforms,O&&(M=E.data.sort.precomputedDistances)),T(w,_,E.data.sort.modelViewProj,O,S,M,F)}else if(E.data.init){y=E.data.init.Constants,a=E.data.init.splatCount,n=E.data.init.useSharedMemory,i=E.data.init.integerBasedSort,r=E.data.init.dynamicMode,x=E.data.init.distanceMapRange,v=0;const _=i?y.BytesPerInt*4:y.BytesPerFloat*4,w=new Uint8Array(E.data.init.sorterWasmBytes),O=16*y.BytesPerFloat,S=a*y.BytesPerInt,M=a*_,F=O,P=i?a*y.BytesPerInt:a*y.BytesPerFloat,D=a*y.BytesPerInt,z=a*y.BytesPerInt,U=i?x*y.BytesPerInt*2:x*y.BytesPerFloat*2,G=r?a*y.BytesPerInt:0,H=r?y.MaxScenes*O:0,Y=y.MemoryPageSize*32,ne=S+M+F+P+D+U+z+G+H+Y,le=Math.floor(ne/y.MemoryPageSize)+1,Be={module:{},env:{memory:new WebAssembly.Memory({initial:le,maximum:le,shared:!0})}};WebAssembly.compile(w).then(Re=>WebAssembly.instantiate(Re,Be)).then(Re=>{e=Re,o=0,g=o+S,A=g+M,d=A+F,p=d+P,h=p+D,l=h+U,c=l+z,u=c+G,t=Be.env.memory.buffer,n?s.postMessage({sortSetupPhase1Complete:!0,indexesToSortBuffer:t,indexesToSortOffset:o,sortedIndexesBuffer:t,sortedIndexesOffset:l,precomputedDistancesBuffer:t,precomputedDistancesOffset:d,transformsBuffer:t,transformsOffset:u}):s.postMessage({sortSetupPhase1Complete:!0})})}}}function oA(s,e,t,n,i,r=Qe.DefaultSplatSortDistanceMapPrecision){const a=new Worker(URL.createObjectURL(new Blob(["(",aA.toString(),")(self)"],{type:"application/javascript"})));let o=iA;const l=xo()?qc():null;!t&&!e?(o=uc,l&&l.major<=16&&l.minor<4&&(o=rA)):t?e||l&&l.major<=16&&l.minor<4&&(o=sA):o=uc;const c=atob(o),u=new Uint8Array(c.length);for(let d=0;d<c.length;d++)u[d]=c.charCodeAt(d);return a.postMessage({init:{sorterWasmBytes:u.buffer,splatCount:s,useSharedMemory:e,integerBasedSort:n,dynamicMode:i,distanceMapRange:1<<r,Constants:{BytesPerFloat:Qe.BytesPerFloat,BytesPerInt:Qe.BytesPerInt,MemoryPageSize:Qe.MemoryPageSize,MaxScenes:Qe.MaxScenes}}}),a}const Fi={None:0,VR:1,AR:2};class ji{static createButton(e,t={}){const n=document.createElement("button");function i(){let c=null;async function u(h){h.addEventListener("end",d),await e.xr.setSession(h),n.textContent="EXIT VR",c=h}function d(){c.removeEventListener("end",d),n.textContent="ENTER VR",c=null}n.style.display="",n.style.cursor="pointer",n.style.left="calc(50% - 50px)",n.style.width="100px",n.textContent="ENTER VR";const p={...t,optionalFeatures:["local-floor","bounded-floor","layers",...t.optionalFeatures||[]]};n.onmouseenter=function(){n.style.opacity="1.0"},n.onmouseleave=function(){n.style.opacity="0.5"},n.onclick=function(){c===null?navigator.xr.requestSession("immersive-vr",p).then(u):(c.end(),navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-vr",p).then(u).catch(h=>{console.warn(h)}))},navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-vr",p).then(u).catch(h=>{console.warn(h)})}function r(){n.style.display="",n.style.cursor="auto",n.style.left="calc(50% - 75px)",n.style.width="150px",n.onmouseenter=null,n.onmouseleave=null,n.onclick=null}function a(){r(),n.textContent="VR NOT SUPPORTED"}function o(c){r(),console.warn("Exception when trying to call xr.isSessionSupported",c),n.textContent="VR NOT ALLOWED"}function l(c){c.style.position="absolute",c.style.bottom="20px",c.style.padding="12px 6px",c.style.border="1px solid #fff",c.style.borderRadius="4px",c.style.background="rgba(0,0,0,0.1)",c.style.color="#fff",c.style.font="normal 13px sans-serif",c.style.textAlign="center",c.style.opacity="0.5",c.style.outline="none",c.style.zIndex="999"}if("xr"in navigator)return n.id="VRButton",n.style.display="none",l(n),navigator.xr.isSessionSupported("immersive-vr").then(function(c){c?i():a(),c&&ji.xrSessionIsGranted&&n.click()}).catch(o),n;{const c=document.createElement("a");return window.isSecureContext===!1?(c.href=document.location.href.replace(/^http:/,"https:"),c.innerHTML="WEBXR NEEDS HTTPS"):(c.href="https://immersiveweb.dev/",c.innerHTML="WEBXR NOT AVAILABLE"),c.style.left="calc(50% - 90px)",c.style.width="180px",c.style.textDecoration="none",l(c),c}}static registerSessionGrantedListener(){if(typeof navigator<"u"&&"xr"in navigator){if(/WebXRViewer\//i.test(navigator.userAgent))return;navigator.xr.addEventListener("sessiongranted",()=>{ji.xrSessionIsGranted=!0})}}}ji.xrSessionIsGranted=!1;ji.registerSessionGrantedListener();class lA{static createButton(e,t={}){const n=document.createElement("button");function i(){if(t.domOverlay===void 0){const p=document.createElement("div");p.style.display="none",document.body.appendChild(p);const h=document.createElementNS("http://www.w3.org/2000/svg","svg");h.setAttribute("width",38),h.setAttribute("height",38),h.style.position="absolute",h.style.right="20px",h.style.top="20px",h.addEventListener("click",function(){c.end()}),p.appendChild(h);const g=document.createElementNS("http://www.w3.org/2000/svg","path");g.setAttribute("d","M 12,12 L 28,28 M 28,12 12,28"),g.setAttribute("stroke","#fff"),g.setAttribute("stroke-width",2),h.appendChild(g),t.optionalFeatures===void 0&&(t.optionalFeatures=[]),t.optionalFeatures.push("dom-overlay"),t.domOverlay={root:p}}let c=null;async function u(p){p.addEventListener("end",d),e.xr.setReferenceSpaceType("local"),await e.xr.setSession(p),n.textContent="STOP AR",t.domOverlay.root.style.display="",c=p}function d(){c.removeEventListener("end",d),n.textContent="START AR",t.domOverlay.root.style.display="none",c=null}n.style.display="",n.style.cursor="pointer",n.style.left="calc(50% - 50px)",n.style.width="100px",n.textContent="START AR",n.onmouseenter=function(){n.style.opacity="1.0"},n.onmouseleave=function(){n.style.opacity="0.5"},n.onclick=function(){c===null?navigator.xr.requestSession("immersive-ar",t).then(u):(c.end(),navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-ar",t).then(u).catch(p=>{console.warn(p)}))},navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-ar",t).then(u).catch(p=>{console.warn(p)})}function r(){n.style.display="",n.style.cursor="auto",n.style.left="calc(50% - 75px)",n.style.width="150px",n.onmouseenter=null,n.onmouseleave=null,n.onclick=null}function a(){r(),n.textContent="AR NOT SUPPORTED"}function o(c){r(),console.warn("Exception when trying to call xr.isSessionSupported",c),n.textContent="AR NOT ALLOWED"}function l(c){c.style.position="absolute",c.style.bottom="20px",c.style.padding="12px 6px",c.style.border="1px solid #fff",c.style.borderRadius="4px",c.style.background="rgba(0,0,0,0.1)",c.style.color="#fff",c.style.font="normal 13px sans-serif",c.style.textAlign="center",c.style.opacity="0.5",c.style.outline="none",c.style.zIndex="999"}if("xr"in navigator)return n.id="ARButton",n.style.display="none",l(n),navigator.xr.isSessionSupported("immersive-ar").then(function(c){c?i():a()}).catch(o),n;{const c=document.createElement("a");return window.isSecureContext===!1?(c.href=document.location.href.replace(/^http:/,"https:"),c.innerHTML="WEBXR NEEDS HTTPS"):(c.href="https://immersiveweb.dev/",c.innerHTML="WEBXR NOT AVAILABLE"),c.style.left="calc(50% - 90px)",c.style.width="180px",c.style.textDecoration="none",l(c),c}}}const fa={Always:0,Never:2},cA=50,uA=.75,dA=15e5,hA=10,fA=2.5,pA=60,Gn=class Gn{constructor(e={}){Z(this,"onKeyDown",function(){const e=new I,t=new ke,n=new ke;return function(i){switch(e.set(0,0,-1),e.transformDirection(this.camera.matrixWorld),t.makeRotationAxis(e,Math.PI/128),n.makeRotationAxis(e,-Math.PI/128),i.code){case"KeyG":this.focalAdjustment+=.02,this.forceRenderNextFrame();break;case"KeyF":this.focalAdjustment-=.02,this.forceRenderNextFrame();break;case"ArrowLeft":this.camera.up.transformDirection(t);break;case"ArrowRight":this.camera.up.transformDirection(n);break;case"KeyC":this.showMeshCursor=!this.showMeshCursor;break;case"KeyU":this.showControlPlane=!this.showControlPlane;break;case"KeyI":this.showInfo=!this.showInfo,this.showInfo?this.infoPanel.show():this.infoPanel.hide();break;case"KeyO":this.usingExternalCamera||this.setOrthographicMode(!this.camera.isOrthographicCamera);break;case"KeyP":this.usingExternalCamera||this.splatMesh.setPointCloudModeEnabled(!this.splatMesh.getPointCloudModeEnabled());break;case"Equal":this.usingExternalCamera||this.splatMesh.setSplatScale(this.splatMesh.getSplatScale()+.05);break;case"Minus":this.usingExternalCamera||this.splatMesh.setSplatScale(Math.max(this.splatMesh.getSplatScale()-.05,0));break}}}());Z(this,"onMouseUp",function(){const e=new Me;return function(t){e.copy(this.mousePosition).sub(this.mouseDownPosition),Pi()-this.mouseDownTime<.5&&e.length()<2&&this.onMouseClick(t)}}());Z(this,"checkForFocalPointChange",function(){const e=new Me,t=new I,n=[];return function(){if(!this.transitioningCameraTarget&&(this.getRenderDimensions(e),n.length=0,this.raycaster.setFromCameraAndScreenPosition(this.camera,this.mousePosition,e),this.raycaster.intersectSplatMesh(this.splatMesh,n),n.length>0)){const r=n[0].origin;t.copy(r).sub(this.camera.position),t.length()>uA&&(this.previousCameraTarget.copy(this.controls.target),this.nextCameraTarget.copy(r),this.transitioningCameraTarget=!0,this.transitioningCameraTargetStartTime=Pi())}}}());Z(this,"updateSplatMesh",function(){const e=new Me;return function(){if(!this.splatMesh)return;if(this.splatMesh.getSplatCount()>0){this.splatMesh.updateVisibleRegionFadeDistance(this.sceneRevealMode),this.splatMesh.updateTransforms(),this.getRenderDimensions(e);const n=this.camera.projectionMatrix.elements[0]*.5*this.devicePixelRatio*e.x,i=this.camera.projectionMatrix.elements[5]*.5*this.devicePixelRatio*e.y,r=this.camera.isOrthographicCamera?1/this.devicePixelRatio:1,a=this.focalAdjustment*r,o=1/a;this.adjustForWebXRStereo(e),this.splatMesh.updateUniforms(e,n*a,i*a,this.camera.isOrthographicCamera,this.camera.zoom||1,o)}}}());Z(this,"addSplatBuffers",function(){return function(e,t=[],n=!0,i=!0,r=!0,a=!1,o=!1,l=!0){if(this.isDisposingOrDisposed())return Promise.resolve();let c=null;const u=()=>{c!==null&&(this.loadingSpinner.removeTask(c),c=null)};return this.splatRenderReady=!1,new Promise(d=>{i&&(c=this.loadingSpinner.addTask("Processing splats...")),Yt(()=>{if(this.isDisposingOrDisposed())d();else{const p=this.addSplatBuffersToMesh(e,t,n,r,a,l),h=this.splatMesh.getMaxSplatCount();this.sortWorker&&this.sortWorker.maxSplatCount!==h&&this.disposeSortWorker(),this.gpuAcceleratedSort||this.preSortMessages.push({centers:p.centers.buffer,sceneIndexes:p.sceneIndexes.buffer,range:{from:p.from,to:p.to,count:p.count}}),(!this.sortWorker&&h>0?this.setupSortWorker(this.splatMesh):Promise.resolve()).then(()=>{this.isDisposingOrDisposed()||this.runSplatSort(!0,!0).then(A=>{!this.sortWorker||!A?(this.splatRenderReady=!0,u(),d()):(o?this.splatRenderReady=!0:this.runAfterNextSort.push(()=>{this.splatRenderReady=!0}),this.runAfterNextSort.push(()=>{u(),d()}))})})}},!0)})}}());Z(this,"addSplatBuffersToMesh",function(){let e;return function(t,n,i=!0,r=!1,a=!1,o=!0){if(this.isDisposingOrDisposed())return;let l=[],c=[];a||(l=this.splatMesh.scenes.map(h=>h.splatBuffer)||[],c=this.splatMesh.sceneOptions?this.splatMesh.sceneOptions.map(h=>h):[]),l.push(...t),c.push(...n),this.renderer&&this.splatMesh.setRenderer(this.renderer);const u=h=>{if(this.isDisposingOrDisposed())return;const g=this.splatMesh.getSplatCount();r&&g>=dA&&!h&&!e&&(this.loadingSpinner.setMinimized(!0,!0),e=this.loadingSpinner.addTask("Optimizing data structures..."))},d=h=>{this.isDisposingOrDisposed()||h&&e&&(this.loadingSpinner.removeTask(e),e=null)},p=this.splatMesh.build(l,c,!0,i,u,d,o);return i&&this.freeIntermediateSplatData&&this.splatMesh.freeIntermediateSplatData(),p}}());Z(this,"shouldRender",function(){let e=0;const t=new I,n=new ut,i=1e-4;return function(){if(!this.initialized||!this.splatRenderReady||this.isDisposingOrDisposed())return!1;let r=!1,a=!1;if(this.camera){const o=this.camera.position,l=this.camera.quaternion;a=Math.abs(o.x-t.x)>i||Math.abs(o.y-t.y)>i||Math.abs(o.z-t.z)>i||Math.abs(l.x-n.x)>i||Math.abs(l.y-n.y)>i||Math.abs(l.z-n.z)>i||Math.abs(l.w-n.w)>i}return r=this.renderMode!==fa.Never&&(e===0||this.splatMesh.visibleRegionChanging||a||this.renderMode===fa.Always||this.dynamicMode===!0||this.renderNextFrame),this.camera&&(t.copy(this.camera.position),n.copy(this.camera.quaternion)),e++,r}}());Z(this,"render",function(){return function(){if(!this.initialized||!this.splatRenderReady||this.isDisposingOrDisposed())return;const e=n=>{for(let i of n.children)if(i.visible)return!0;return!1},t=this.renderer.autoClear;e(this.threeScene)&&(this.renderer.render(this.threeScene,this.camera),this.renderer.autoClear=!1),this.renderer.render(this.splatMesh,this.camera),this.renderer.autoClear=!1,this.sceneHelper.getFocusMarkerOpacity()>0&&this.renderer.render(this.sceneHelper.focusMarker,this.camera),this.showControlPlane&&this.renderer.render(this.sceneHelper.controlPlane,this.camera),this.renderer.autoClear=t}}());Z(this,"updateFPS",function(){let e=Pi(),t=0;return function(){if(this.consecutiveRenderFrames>pA){const n=Pi();n-e>=1?(this.currentFPS=t,t=0,e=n):t++}else this.currentFPS=null}}());Z(this,"updateForRendererSizeChanges",function(){const e=new Me,t=new Me;let n;return function(){this.usingExternalCamera||(this.renderer.getSize(t),(n===void 0||n!==this.camera.isOrthographicCamera||t.x!==e.x||t.y!==e.y)&&(this.camera.isOrthographicCamera?(this.camera.left=-t.x/2,this.camera.right=t.x/2,this.camera.top=t.y/2,this.camera.bottom=-t.y/2):this.camera.aspect=t.x/t.y,this.camera.updateProjectionMatrix(),e.copy(t),n=this.camera.isOrthographicCamera))}}());Z(this,"timingSensitiveUpdates",function(){let e;return function(){const t=Pi();e||(e=t);const n=t-e;this.updateCameraTransition(t),this.updateFocusMarker(n),e=t}}());Z(this,"updateCameraTransition",function(){let e=new I,t=new I,n=new I;return function(i){if(this.transitioningCameraTarget){t.copy(this.previousCameraTarget).sub(this.camera.position).normalize(),n.copy(this.nextCameraTarget).sub(this.camera.position).normalize();const r=Math.acos(t.dot(n)),o=(r/(Math.PI/3)*.65+.3)/r*(i-this.transitioningCameraTargetStartTime);e.copy(this.previousCameraTarget).lerp(this.nextCameraTarget,o),this.camera.lookAt(e),this.controls.target.copy(e),o>=1&&(this.transitioningCameraTarget=!1)}}}());Z(this,"updateFocusMarker",function(){const e=new Me;let t=!1;return function(n){if(this.getRenderDimensions(e),this.transitioningCameraTarget){this.sceneHelper.setFocusMarkerVisibility(!0);const i=Math.max(this.sceneHelper.getFocusMarkerOpacity(),0);let r=Math.min(i+hA*n,1);this.sceneHelper.setFocusMarkerOpacity(r),this.sceneHelper.updateFocusMarker(this.nextCameraTarget,this.camera,e),t=!0,this.forceRenderNextFrame()}else{let i;if(t?i=1:i=Math.min(this.sceneHelper.getFocusMarkerOpacity(),1),i>0){this.sceneHelper.updateFocusMarker(this.nextCameraTarget,this.camera,e);let r=Math.max(i-fA*n,0);this.sceneHelper.setFocusMarkerOpacity(r),r===0&&this.sceneHelper.setFocusMarkerVisibility(!1)}i>0&&this.forceRenderNextFrame(),t=!1}}}());Z(this,"updateMeshCursor",function(){const e=[],t=new Me;return function(){this.showMeshCursor?(this.forceRenderNextFrame(),this.getRenderDimensions(t),e.length=0,this.raycaster.setFromCameraAndScreenPosition(this.camera,this.mousePosition,t),this.raycaster.intersectSplatMesh(this.splatMesh,e),e.length>0?(this.sceneHelper.setMeshCursorVisibility(!0),this.sceneHelper.positionAndOrientMeshCursor(e[0].origin,this.camera)):this.sceneHelper.setMeshCursorVisibility(!1)):(this.sceneHelper.getMeschCursorVisibility()&&this.forceRenderNextFrame(),this.sceneHelper.setMeshCursorVisibility(!1))}}());Z(this,"updateInfoPanel",function(){const e=new Me;return function(){if(!this.showInfo)return;const t=this.splatMesh.getSplatCount();this.getRenderDimensions(e);const n=this.controls?this.controls.target:null,i=this.showMeshCursor?this.sceneHelper.meshCursor.position:null,r=t>0?this.splatRenderCount/t*100:0;this.infoPanel.update(e,this.camera.position,n,this.camera.up,this.camera.isOrthographicCamera,i,this.currentFPS||"N/A",t,this.splatRenderCount,r,this.lastSortTime,this.focalAdjustment,this.splatMesh.getSplatScale(),this.splatMesh.getPointCloudModeEnabled())}}());Z(this,"runSplatSort",function(){const e=new ke,t=[],n=new I(0,0,-1),i=new I(0,0,-1),r=new I,a=new I,o=[],l=[{angleThreshold:.55,sortFractions:[.125,.33333,.75]},{angleThreshold:.65,sortFractions:[.33333,.66667]},{angleThreshold:.8,sortFractions:[.5]}];return function(c=!1,u=!1){if(!this.initialized)return Promise.resolve(!1);if(this.sortRunning)return Promise.resolve(!0);if(this.splatMesh.getSplatCount()<=0)return this.splatRenderCount=0,Promise.resolve(!1);let d=0,p=0,h=!1,g=!1;if(i.set(0,0,-1).applyQuaternion(this.camera.quaternion),d=i.dot(n),p=a.copy(this.camera.position).sub(r).length(),!c&&!this.splatMesh.dynamicMode&&o.length===0&&(d<=.99&&(h=!0),p>=1&&(g=!0),!h&&!g))return Promise.resolve(!1);this.sortRunning=!0;let{splatRenderCount:A,shouldSortAll:f}=this.gatherSceneNodesForSort();f=f||u,this.splatRenderCount=A,e.copy(this.camera.matrixWorld).invert();const m=this.perspectiveCamera||this.camera;e.premultiply(m.projectionMatrix),this.splatMesh.dynamicMode||e.multiply(this.splatMesh.matrixWorld);let x=Promise.resolve(!0);return this.gpuAcceleratedSort&&(o.length<=1||o.length%2===0)&&(x=this.splatMesh.computeDistancesOnGPU(e,this.sortWorkerPrecomputedDistances)),x.then(()=>{if(o.length===0)if(this.splatMesh.dynamicMode||f)o.push(this.splatRenderCount);else{for(let T of l)if(d<T.angleThreshold){for(let E of T.sortFractions)o.push(Math.floor(this.splatRenderCount*E));break}o.push(this.splatRenderCount)}let v=Math.min(o.shift(),this.splatRenderCount);this.splatSortCount=v,t[0]=this.camera.position.x,t[1]=this.camera.position.y,t[2]=this.camera.position.z;const y={modelViewProj:e.elements,cameraPosition:t,splatRenderCount:this.splatRenderCount,splatSortCount:v,usePrecomputedDistances:this.gpuAcceleratedSort};return this.splatMesh.dynamicMode&&this.splatMesh.fillTransformsArray(this.sortWorkerTransforms),this.sharedMemoryForWorkers||(y.indexesToSort=this.sortWorkerIndexesToSort,y.transforms=this.sortWorkerTransforms,this.gpuAcceleratedSort&&(y.precomputedDistances=this.sortWorkerPrecomputedDistances)),this.sortPromise=new Promise(T=>{this.sortPromiseResolver=T}),this.preSortMessages.length>0&&(this.preSortMessages.forEach(T=>{this.sortWorker.postMessage(T)}),this.preSortMessages=[]),this.sortWorker.postMessage({sort:y}),o.length===0&&(r.copy(this.camera.position),n.copy(i)),!0}),x}}());Z(this,"gatherSceneNodesForSort",function(){const e=[];let t=null;const n=new I,i=new I,r=new I,a=new ke,o=new ke,l=new ke,c=new I,u=new I(0,0,-1),d=new I,p=h=>d.copy(h.max).sub(h.min).length();return function(h=!1){this.getRenderDimensions(c);const g=c.y/2/Math.tan(this.camera.fov/2*fo.DEG2RAD),A=Math.atan(c.x/2/g),f=Math.atan(c.y/2/g),m=Math.cos(A),x=Math.cos(f),v=this.splatMesh.getSplatTree();if(v){o.copy(this.camera.matrixWorld).invert(),this.splatMesh.dynamicMode||o.multiply(this.splatMesh.matrixWorld);let y=0,T=0;for(let _=0;_<v.subTrees.length;_++){const w=v.subTrees[_];a.copy(o),this.splatMesh.dynamicMode&&(this.splatMesh.getSceneTransform(_,l),a.multiply(l));const O=w.nodesWithIndexes.length;for(let S=0;S<O;S++){const M=w.nodesWithIndexes[S];if(!M.data||!M.data.indexes||M.data.indexes.length===0)continue;r.copy(M.center).applyMatrix4(a);const F=r.length();r.normalize(),n.copy(r).setX(0).normalize(),i.copy(r).setY(0).normalize();const P=u.dot(i),D=u.dot(n),z=p(M),U=D<x-.6,G=P<m-.6;!h&&(G||U)&&F>z||(T+=M.data.indexes.length,e[y]=M,M.data.distanceToNode=F,y++)}}e.length=y,e.sort((_,w)=>_.data.distanceToNode<w.data.distanceToNode?-1:1);let E=T*Qe.BytesPerInt;for(let _=0;_<y;_++){const w=e[_],O=w.data.indexes.length,S=O*Qe.BytesPerInt;new Uint32Array(this.sortWorkerIndexesToSort.buffer,E-S,O).set(w.data.indexes),E-=S}return{splatRenderCount:T,shouldSortAll:!1}}else{const y=this.splatMesh.getSplatCount();if(!t||t.length!==y){t=new Uint32Array(y);for(let T=0;T<y;T++)t[T]=T}return this.sortWorkerIndexesToSort.set(t),{splatRenderCount:y,shouldSortAll:!0}}}}());if(e.cameraUp||(e.cameraUp=[0,1,0]),this.cameraUp=new I().fromArray(e.cameraUp),e.initialCameraPosition||(e.initialCameraPosition=[0,10,15]),this.initialCameraPosition=new I().fromArray(e.initialCameraPosition),e.initialCameraLookAt||(e.initialCameraLookAt=[0,0,0]),this.initialCameraLookAt=new I().fromArray(e.initialCameraLookAt),this.dropInMode=e.dropInMode||!1,(e.selfDrivenMode===void 0||e.selfDrivenMode===null)&&(e.selfDrivenMode=!0),this.selfDrivenMode=e.selfDrivenMode&&!this.dropInMode,this.selfDrivenUpdateFunc=this.selfDrivenUpdate.bind(this),e.useBuiltInControls===void 0&&(e.useBuiltInControls=!0),this.useBuiltInControls=e.useBuiltInControls,this.rootElement=e.rootElement,this.ignoreDevicePixelRatio=e.ignoreDevicePixelRatio||!1,this.devicePixelRatio=this.ignoreDevicePixelRatio?1:window.devicePixelRatio||1,this.halfPrecisionCovariancesOnGPU=e.halfPrecisionCovariancesOnGPU||!1,this.threeScene=e.threeScene,this.renderer=e.renderer,this.camera=e.camera,this.gpuAcceleratedSort=e.gpuAcceleratedSort||!1,(e.integerBasedSort===void 0||e.integerBasedSort===null)&&(e.integerBasedSort=!0),this.integerBasedSort=e.integerBasedSort,(e.sharedMemoryForWorkers===void 0||e.sharedMemoryForWorkers===null)&&(e.sharedMemoryForWorkers=!0),this.sharedMemoryForWorkers=e.sharedMemoryForWorkers,this.dynamicScene=!!e.dynamicScene,this.antialiased=e.antialiased||!1,this.kernel2DSize=e.kernel2DSize===void 0?.3:e.kernel2DSize,this.webXRMode=e.webXRMode||Fi.None,this.webXRMode!==Fi.None&&(this.gpuAcceleratedSort=!1),this.webXRActive=!1,this.webXRSessionInit=e.webXRSessionInit||{},this.renderMode=e.renderMode||fa.Always,this.sceneRevealMode=e.sceneRevealMode||hs.Default,this.focalAdjustment=e.focalAdjustment||1,this.maxScreenSpaceSplatSize=e.maxScreenSpaceSplatSize||1024,this.logLevel=e.logLevel||Vi.None,this.sphericalHarmonicsDegree=e.sphericalHarmonicsDegree||0,this.enableOptionalEffects=e.enableOptionalEffects||!1,(e.enableSIMDInSort===void 0||e.enableSIMDInSort===null)&&(e.enableSIMDInSort=!0),this.enableSIMDInSort=e.enableSIMDInSort,(e.inMemoryCompressionLevel===void 0||e.inMemoryCompressionLevel===null)&&(e.inMemoryCompressionLevel=0),this.inMemoryCompressionLevel=e.inMemoryCompressionLevel,(e.optimizeSplatData===void 0||e.optimizeSplatData===null)&&(e.optimizeSplatData=!0),this.optimizeSplatData=e.optimizeSplatData,(e.freeIntermediateSplatData===void 0||e.freeIntermediateSplatData===null)&&(e.freeIntermediateSplatData=!1),this.freeIntermediateSplatData=e.freeIntermediateSplatData,xo()){const n=qc();n.major<17&&(this.enableSIMDInSort=!1),n.major<16&&(this.sharedMemoryForWorkers=!1)}(e.splatRenderMode===void 0||e.splatRenderMode===null)&&(e.splatRenderMode=wn.ThreeD),this.splatRenderMode=e.splatRenderMode,this.sceneFadeInRateMultiplier=e.sceneFadeInRateMultiplier||1,this.splatSortDistanceMapPrecision=e.splatSortDistanceMapPrecision||Qe.DefaultSplatSortDistanceMapPrecision;const t=this.integerBasedSort?20:24;this.splatSortDistanceMapPrecision=ht(this.splatSortDistanceMapPrecision,10,t),this.onSplatMeshChangedCallback=null,this.createSplatMesh(),this.controls=null,this.perspectiveControls=null,this.orthographicControls=null,this.orthographicCamera=null,this.perspectiveCamera=null,this.showMeshCursor=!1,this.showControlPlane=!1,this.showInfo=!1,this.sceneHelper=null,this.sortWorker=null,this.sortRunning=!1,this.splatRenderCount=0,this.splatSortCount=0,this.lastSplatSortCount=0,this.sortWorkerIndexesToSort=null,this.sortWorkerSortedIndexes=null,this.sortWorkerPrecomputedDistances=null,this.sortWorkerTransforms=null,this.preSortMessages=[],this.runAfterNextSort=[],this.selfDrivenModeRunning=!1,this.splatRenderReady=!1,this.raycaster=new k0,this.infoPanel=null,this.startInOrthographicMode=!1,this.currentFPS=0,this.lastSortTime=0,this.consecutiveRenderFrames=0,this.previousCameraTarget=new I,this.nextCameraTarget=new I,this.mousePosition=new Me,this.mouseDownPosition=new Me,this.mouseDownTime=null,this.resizeObserver=null,this.mouseMoveListener=null,this.mouseDownListener=null,this.mouseUpListener=null,this.keyDownListener=null,this.sortPromise=null,this.sortPromiseResolver=null,this.splatSceneDownloadPromises={},this.splatSceneDownloadAndBuildPromise=null,this.splatSceneRemovalPromise=null,this.loadingSpinner=new no(null,this.rootElement||document.body),this.loadingSpinner.hide(),this.loadingProgressBar=new L0(this.rootElement||document.body),this.loadingProgressBar.hide(),this.infoPanel=new B0(this.rootElement||document.body),this.infoPanel.hide(),this.usingExternalCamera=!!(this.dropInMode||this.camera),this.usingExternalRenderer=!!(this.dropInMode||this.renderer),this.initialized=!1,this.disposing=!1,this.disposed=!1,this.disposePromise=null,this.dropInMode||this.init()}createSplatMesh(){this.splatMesh=new Rt(this.splatRenderMode,this.dynamicScene,this.enableOptionalEffects,this.halfPrecisionCovariancesOnGPU,this.devicePixelRatio,this.gpuAcceleratedSort,this.integerBasedSort,this.antialiased,this.maxScreenSpaceSplatSize,this.logLevel,this.sphericalHarmonicsDegree,this.sceneFadeInRateMultiplier,this.kernel2DSize),this.splatMesh.frustumCulled=!1,this.onSplatMeshChangedCallback&&this.onSplatMeshChangedCallback()}init(){this.initialized||(this.rootElement||(this.usingExternalRenderer?this.rootElement=this.renderer.domElement||document.body:(this.rootElement=document.createElement("div"),this.rootElement.style.width="100%",this.rootElement.style.height="100%",this.rootElement.style.position="absolute",document.body.appendChild(this.rootElement))),this.setupCamera(),this.setupRenderer(),this.setupWebXR(this.webXRSessionInit),this.setupControls(),this.setupEventHandlers(),this.threeScene=this.threeScene||new bg,this.sceneHelper=new us(this.threeScene),this.sceneHelper.setupMeshCursor(),this.sceneHelper.setupFocusMarker(),this.sceneHelper.setupControlPlane(),this.loadingProgressBar.setContainer(this.rootElement),this.loadingSpinner.setContainer(this.rootElement),this.infoPanel.setContainer(this.rootElement),this.initialized=!0)}setupCamera(){if(!this.usingExternalCamera){const e=new Me;this.getRenderDimensions(e),this.perspectiveCamera=new en(cA,e.x/e.y,.1,1e3),this.orthographicCamera=new po(e.x/-2,e.x/2,e.y/2,e.y/-2,.1,1e3),this.camera=this.startInOrthographicMode?this.orthographicCamera:this.perspectiveCamera,this.camera.position.copy(this.initialCameraPosition),this.camera.up.copy(this.cameraUp).normalize(),this.camera.lookAt(this.initialCameraLookAt)}}setupRenderer(){if(!this.usingExternalRenderer){const e=new Me;this.getRenderDimensions(e),this.renderer=new Tg({antialias:!1,precision:"highp"}),this.renderer.setPixelRatio(this.devicePixelRatio),this.renderer.autoClear=!0,this.renderer.setClearColor(new Ze(0),0),this.renderer.setSize(e.x,e.y),this.resizeObserver=new ResizeObserver(()=>{this.getRenderDimensions(e),this.renderer.setSize(e.x,e.y),this.forceRenderNextFrame()}),this.resizeObserver.observe(this.rootElement),this.rootElement.appendChild(this.renderer.domElement)}}setupWebXR(e){this.webXRMode&&(this.webXRMode===Fi.VR?this.rootElement.appendChild(ji.createButton(this.renderer,e)):this.webXRMode===Fi.AR&&this.rootElement.appendChild(lA.createButton(this.renderer,e)),this.renderer.xr.addEventListener("sessionstart",t=>{this.webXRActive=!0}),this.renderer.xr.addEventListener("sessionend",t=>{this.webXRActive=!1}),this.renderer.xr.enabled=!0,this.camera.position.copy(this.initialCameraPosition),this.camera.up.copy(this.cameraUp).normalize(),this.camera.lookAt(this.initialCameraLookAt))}setupControls(){if(this.useBuiltInControls&&this.webXRMode===Fi.None){this.usingExternalCamera?this.camera.isOrthographicCamera?this.orthographicControls=new Zs(this.camera,this.renderer.domElement):this.perspectiveControls=new Zs(this.camera,this.renderer.domElement):(this.perspectiveControls=new Zs(this.perspectiveCamera,this.renderer.domElement),this.orthographicControls=new Zs(this.orthographicCamera,this.renderer.domElement));for(let e of[this.orthographicControls,this.perspectiveControls])e&&(e.listenToKeyEvents(window),e.rotateSpeed=.5,e.maxPolarAngle=Math.PI*.75,e.minPolarAngle=.1,e.enableDamping=!0,e.dampingFactor=.05,e.target.copy(this.initialCameraLookAt),e.update());this.controls=this.camera.isOrthographicCamera?this.orthographicControls:this.perspectiveControls,this.controls.update()}}setupEventHandlers(){this.useBuiltInControls&&this.webXRMode===Fi.None&&(this.mouseMoveListener=this.onMouseMove.bind(this),this.renderer.domElement.addEventListener("pointermove",this.mouseMoveListener,!1),this.mouseDownListener=this.onMouseDown.bind(this),this.renderer.domElement.addEventListener("pointerdown",this.mouseDownListener,!1),this.mouseUpListener=this.onMouseUp.bind(this),this.renderer.domElement.addEventListener("pointerup",this.mouseUpListener,!1),this.keyDownListener=this.onKeyDown.bind(this),window.addEventListener("keydown",this.keyDownListener,!1))}removeEventHandlers(){this.useBuiltInControls&&(this.renderer.domElement.removeEventListener("pointermove",this.mouseMoveListener),this.mouseMoveListener=null,this.renderer.domElement.removeEventListener("pointerdown",this.mouseDownListener),this.mouseDownListener=null,this.renderer.domElement.removeEventListener("pointerup",this.mouseUpListener),this.mouseUpListener=null,window.removeEventListener("keydown",this.keyDownListener),this.keyDownListener=null)}setRenderMode(e){this.renderMode=e}setActiveSphericalHarmonicsDegrees(e){this.splatMesh.material.uniforms.sphericalHarmonicsDegree.value=e,this.splatMesh.material.uniformsNeedUpdate=!0}onSplatMeshChanged(e){this.onSplatMeshChangedCallback=e}onMouseMove(e){this.mousePosition.set(e.offsetX,e.offsetY)}onMouseDown(){this.mouseDownPosition.copy(this.mousePosition),this.mouseDownTime=Pi()}onMouseClick(e){this.mousePosition.set(e.offsetX,e.offsetY),this.checkForFocalPointChange()}getRenderDimensions(e){this.rootElement?(e.x=this.rootElement.offsetWidth,e.y=this.rootElement.offsetHeight):this.renderer.getSize(e)}setOrthographicMode(e){if(e===this.camera.isOrthographicCamera)return;const t=this.camera,n=e?this.orthographicCamera:this.perspectiveCamera;if(n.position.copy(t.position),n.up.copy(t.up),n.rotation.copy(t.rotation),n.quaternion.copy(t.quaternion),n.matrix.copy(t.matrix),this.camera=n,this.controls){const i=o=>{o.saveState(),o.reset()},r=this.controls,a=e?this.orthographicControls:this.perspectiveControls;i(a),i(r),a.target.copy(r.target),e?Gn.setCameraZoomFromPosition(n,t,r):Gn.setCameraPositionFromZoom(n,t,a),this.controls=a,this.camera.lookAt(this.controls.target)}}adjustForWebXRStereo(e){if(this.camera&&this.webXRActive){const n=this.renderer.xr.getCamera().projectionMatrix.elements[0],i=this.camera.projectionMatrix.elements[0];e.x*=i/n}}isLoadingOrUnloading(){return Object.keys(this.splatSceneDownloadPromises).length>0||this.splatSceneDownloadAndBuildPromise!==null||this.splatSceneRemovalPromise!==null}isDisposingOrDisposed(){return this.disposing||this.disposed}addSplatSceneDownloadPromise(e){this.splatSceneDownloadPromises[e.id]=e}removeSplatSceneDownloadPromise(e){delete this.splatSceneDownloadPromises[e.id]}setSplatSceneDownloadAndBuildPromise(e){this.splatSceneDownloadAndBuildPromise=e}clearSplatSceneDownloadAndBuildPromise(){this.splatSceneDownloadAndBuildPromise=null}addSplatScene(e,t={}){if(this.isLoadingOrUnloading())throw new Error("Cannot add splat scene while another load or unload is already in progress.");if(this.isDisposingOrDisposed())throw new Error("Cannot add splat scene after dispose() is called.");t.progressiveLoad&&this.splatMesh.scenes&&this.splatMesh.scenes.length>0&&(console.log('addSplatScene(): "progressiveLoad" option ignore because there are multiple splat scenes'),t.progressiveLoad=!1);const n=t.format!==void 0&&t.format!==null?t.format:tc(e),i=Gn.isProgressivelyLoadable(n)&&t.progressiveLoad,r=t.showLoadingUI!==void 0&&t.showLoadingUI!==null?t.showLoadingUI:!0;let a=null;r&&(this.loadingSpinner.removeAllTasks(),a=this.loadingSpinner.addTask("Downloading..."));const o=()=>{this.loadingProgressBar.hide(),this.loadingSpinner.removeAllTasks()},l=(A,f,m)=>{if(r)if(m===vt.Downloading)if(A==100)this.loadingSpinner.setMessageForTask(a,"Download complete!");else if(i)this.loadingSpinner.setMessageForTask(a,"Downloading splats...");else{const x=f?`: ${f}`:"...";this.loadingSpinner.setMessageForTask(a,`Downloading${x}`)}else m===vt.Processing&&this.loadingSpinner.setMessageForTask(a,"Processing splats...")};let c=!1,u=0;const d=(A,f)=>{r&&((A&&i||f&&!i)&&(this.loadingSpinner.removeTask(a),!f&&!c&&this.loadingProgressBar.show()),i&&(f?(c=!0,this.loadingProgressBar.hide()):this.loadingProgressBar.setProgress(u)))},p=(A,f,m)=>{u=A,l(A,f,m),t.onProgress&&t.onProgress(A,f,m)},h=(A,f,m)=>{!i&&t.onProgress&&t.onProgress(0,"0%",vt.Processing);const x={rotation:t.rotation||t.orientation,position:t.position,scale:t.scale,splatAlphaRemovalThreshold:t.splatAlphaRemovalThreshold};return this.addSplatBuffers([A],[x],m,f&&r,r,i,i).then(()=>{!i&&t.onProgress&&t.onProgress(100,"100%",vt.Processing),d(f,m)})};return(i?this.downloadAndBuildSingleSplatSceneProgressiveLoad.bind(this):this.downloadAndBuildSingleSplatSceneStandardLoad.bind(this))(e,n,t.splatAlphaRemovalThreshold,h.bind(this),p,o.bind(this),t.headers)}downloadAndBuildSingleSplatSceneStandardLoad(e,t,n,i,r,a,o){const l=this.downloadSplatSceneToSplatBuffer(e,n,r,!1,void 0,t,o),c=ra(l.abortHandler);return l.then(u=>(this.removeSplatSceneDownloadPromise(l),i(u,!0,!0).then(()=>{c.resolve(),this.clearSplatSceneDownloadAndBuildPromise()}))).catch(u=>{a&&a(),this.clearSplatSceneDownloadAndBuildPromise(),this.removeSplatSceneDownloadPromise(l),c.reject(this.updateError(u,`Viewer::addSplatScene -> Could not load file ${e}`))}),this.addSplatSceneDownloadPromise(l),this.setSplatSceneDownloadAndBuildPromise(c.promise),c.promise}downloadAndBuildSingleSplatSceneProgressiveLoad(e,t,n,i,r,a,o){let l=0,c=!1;const u=[],d=()=>{if(u.length>0&&!c&&!this.isDisposingOrDisposed()){c=!0;const f=u.shift();i(f.splatBuffer,f.firstBuild,f.finalBuild).then(()=>{c=!1,f.firstBuild?g.resolve():f.finalBuild&&(A.resolve(),this.clearSplatSceneDownloadAndBuildPromise()),u.length>0&&Yt(()=>d())})}},p=(f,m)=>{this.isDisposingOrDisposed()||(m||u.length===0||f.getSplatCount()>u[0].splatBuffer.getSplatCount())&&(u.push({splatBuffer:f,firstBuild:l===0,finalBuild:m}),l++,d())},h=this.downloadSplatSceneToSplatBuffer(e,n,r,!0,p,t,o),g=ra(h.abortHandler),A=ra();return this.addSplatSceneDownloadPromise(h),this.setSplatSceneDownloadAndBuildPromise(A.promise),h.then(()=>{this.removeSplatSceneDownloadPromise(h)}).catch(f=>{this.clearSplatSceneDownloadAndBuildPromise(),this.removeSplatSceneDownloadPromise(h);const m=this.updateError(f,"Viewer::addSplatScene -> Could not load one or more scenes");g.reject(m),a&&a(m)}),g.promise}addSplatScenes(e,t=!0,n=void 0){if(this.isLoadingOrUnloading())throw new Error("Cannot add splat scene while another load or unload is already in progress.");if(this.isDisposingOrDisposed())throw new Error("Cannot add splat scene after dispose() is called.");const i=e.length,r=[];let a;t&&(this.loadingSpinner.removeAllTasks(),a=this.loadingSpinner.addTask("Downloading..."));const o=(d,p,h,g)=>{r[d]=p;let A=0;for(let f=0;f<i;f++)A+=r[f]||0;A=A/i,h=`${A.toFixed(2)}%`,t&&g===vt.Downloading&&this.loadingSpinner.setMessageForTask(a,A==100?"Download complete!":`Downloading: ${h}`),n&&n(A,h,g)},l=[],c=[];for(let d=0;d<e.length;d++){const p=e[d],h=p.format!==void 0&&p.format!==null?p.format:tc(p.path),g=this.downloadSplatSceneToSplatBuffer(p.path,p.splatAlphaRemovalThreshold,o.bind(this,d),!1,void 0,h,p.headers);l.push(g),c.push(g.promise)}const u=new vs((d,p)=>{Promise.all(c).then(h=>{t&&this.loadingSpinner.removeTask(a),n&&n(0,"0%",vt.Processing),this.addSplatBuffers(h,e,!0,t,t,!1,!1).then(()=>{n&&n(100,"100%",vt.Processing),this.clearSplatSceneDownloadAndBuildPromise(),d()})}).catch(h=>{t&&this.loadingSpinner.removeTask(a),this.clearSplatSceneDownloadAndBuildPromise(),p(this.updateError(h,"Viewer::addSplatScenes -> Could not load one or more splat scenes."))}).finally(()=>{this.removeSplatSceneDownloadPromise(u)})},d=>{for(let p of l)p.abort(d)});return this.addSplatSceneDownloadPromise(u),this.setSplatSceneDownloadAndBuildPromise(u),u}downloadSplatSceneToSplatBuffer(e,t=1,n=void 0,i=!1,r=void 0,a,o){try{if(a===It.Splat||a===It.KSplat||a===It.Ply){const l=i?!1:this.optimizeSplatData;if(a===It.Splat)return Po.loadFromURL(e,n,i,r,t,this.inMemoryCompressionLevel,l,o);if(a===It.KSplat)return to.loadFromURL(e,n,i,r,o);if(a===It.Ply)return Ro.loadFromURL(e,n,i,r,t,this.inMemoryCompressionLevel,l,this.sphericalHarmonicsDegree,o)}else if(a===It.Spz)return Io.loadFromURL(e,n,t,this.inMemoryCompressionLevel,this.optimizeSplatData,this.sphericalHarmonicsDegree,o)}catch(l){throw this.updateError(l,null)}throw new Error(`Viewer::downloadSplatSceneToSplatBuffer -> File format not supported: ${e}`)}static isProgressivelyLoadable(e){return e===It.Splat||e===It.KSplat||e===It.Ply}setupSortWorker(e){if(!this.isDisposingOrDisposed())return new Promise(t=>{const n=this.integerBasedSort?Int32Array:Float32Array,i=e.getSplatCount(),r=e.getMaxSplatCount();this.sortWorker=oA(r,this.sharedMemoryForWorkers,this.enableSIMDInSort,this.integerBasedSort,this.splatMesh.dynamicMode,this.splatSortDistanceMapPrecision),this.sortWorker.onmessage=a=>{if(a.data.sortDone){if(this.sortRunning=!1,this.sharedMemoryForWorkers)this.splatMesh.updateRenderIndexes(this.sortWorkerSortedIndexes,a.data.splatRenderCount);else{const o=new Uint32Array(a.data.sortedIndexes.buffer,0,a.data.splatRenderCount);this.splatMesh.updateRenderIndexes(o,a.data.splatRenderCount)}this.lastSplatSortCount=this.splatSortCount,this.lastSortTime=a.data.sortTime,this.sortPromiseResolver(),this.sortPromiseResolver=null,this.forceRenderNextFrame(),this.runAfterNextSort.length>0&&(this.runAfterNextSort.forEach(o=>{o()}),this.runAfterNextSort.length=0)}else if(a.data.sortCanceled)this.sortRunning=!1;else if(a.data.sortSetupPhase1Complete){this.logLevel>=Vi.Info&&console.log("Sorting web worker WASM setup complete."),this.sharedMemoryForWorkers?(this.sortWorkerSortedIndexes=new Uint32Array(a.data.sortedIndexesBuffer,a.data.sortedIndexesOffset,r),this.sortWorkerIndexesToSort=new Uint32Array(a.data.indexesToSortBuffer,a.data.indexesToSortOffset,r),this.sortWorkerPrecomputedDistances=new n(a.data.precomputedDistancesBuffer,a.data.precomputedDistancesOffset,r),this.sortWorkerTransforms=new Float32Array(a.data.transformsBuffer,a.data.transformsOffset,Qe.MaxScenes*16)):(this.sortWorkerIndexesToSort=new Uint32Array(r),this.sortWorkerPrecomputedDistances=new n(r),this.sortWorkerTransforms=new Float32Array(Qe.MaxScenes*16));for(let o=0;o<i;o++)this.sortWorkerIndexesToSort[o]=o;if(this.sortWorker.maxSplatCount=r,this.logLevel>=Vi.Info){console.log("Sorting web worker ready.");const o=this.splatMesh.getSplatDataTextures(),l=o.covariances.size,c=o.centerColors.size;console.log("Covariances texture size: "+l.x+" x "+l.y),console.log("Centers/colors texture size: "+c.x+" x "+c.y)}t()}}})}updateError(e,t){return e instanceof Xc?e:e instanceof fr?new Error("File type or server does not support progressive loading."):t?new Error(t):e}disposeSortWorker(){this.sortWorker&&this.sortWorker.terminate(),this.sortWorker=null,this.sortPromise=null,this.sortPromiseResolver&&(this.sortPromiseResolver(),this.sortPromiseResolver=null),this.preSortMessages=[],this.sortRunning=!1}removeSplatScene(e,t=!0){return this.removeSplatScenes([e],t)}removeSplatScenes(e,t=!0){if(this.isLoadingOrUnloading())throw new Error("Cannot remove splat scene while another load or unload is already in progress.");if(this.isDisposingOrDisposed())throw new Error("Cannot remove splat scene after dispose() is called.");let n;return this.splatSceneRemovalPromise=new Promise((i,r)=>{let a;t&&(this.loadingSpinner.removeAllTasks(),this.loadingSpinner.show(),a=this.loadingSpinner.addTask("Removing splat scene..."));const o=()=>{t&&(this.loadingSpinner.hide(),this.loadingSpinner.removeTask(a))},l=u=>{o(),this.splatSceneRemovalPromise=null,u?r(u):i()},c=()=>this.isDisposingOrDisposed()?(l(),!0):!1;n=this.sortPromise||Promise.resolve(),n.then(()=>{if(c())return;const u=[],d=[],p=[];for(let h=0;h<this.splatMesh.scenes.length;h++){let g=!1;for(let A of e)if(A===h){g=!0;break}if(!g){const A=this.splatMesh.scenes[h];u.push(A.splatBuffer),d.push(this.splatMesh.sceneOptions[h]),p.push({position:A.position.clone(),quaternion:A.quaternion.clone(),scale:A.scale.clone()})}}this.disposeSortWorker(),this.splatMesh.dispose(),this.sceneRevealMode=hs.Instant,this.createSplatMesh(),this.addSplatBuffers(u,d,!0,!1,!0).then(()=>{c()||(o(),this.splatMesh.scenes.forEach((h,g)=>{h.position.copy(p[g].position),h.quaternion.copy(p[g].quaternion),h.scale.copy(p[g].scale)}),this.splatMesh.updateTransforms(),this.splatRenderReady=!1,this.runSplatSort(!0).then(()=>{if(c()){this.splatRenderReady=!0;return}n=this.sortPromise||Promise.resolve(),n.then(()=>{this.splatRenderReady=!0,l()})}))}).catch(h=>{l(h)})})}),this.splatSceneRemovalPromise}start(){if(this.selfDrivenMode)this.webXRMode?this.renderer.setAnimationLoop(this.selfDrivenUpdateFunc):this.requestFrameId=requestAnimationFrame(this.selfDrivenUpdateFunc),this.selfDrivenModeRunning=!0;else throw new Error("Cannot start viewer unless it is in self driven mode.")}stop(){this.selfDrivenMode&&this.selfDrivenModeRunning&&(this.webXRMode?this.renderer.setAnimationLoop(null):cancelAnimationFrame(this.requestFrameId),this.selfDrivenModeRunning=!1)}async dispose(){if(this.isDisposingOrDisposed())return this.disposePromise;let e=[],t=[];for(let n in this.splatSceneDownloadPromises)if(this.splatSceneDownloadPromises.hasOwnProperty(n)){const i=this.splatSceneDownloadPromises[n];t.push(i),e.push(i.promise)}return this.sortPromise&&e.push(this.sortPromise),this.disposing=!0,this.disposePromise=Promise.all(e).finally(()=>{this.stop(),this.orthographicControls&&(this.orthographicControls.dispose(),this.orthographicControls=null),this.perspectiveControls&&(this.perspectiveControls.dispose(),this.perspectiveControls=null),this.controls=null,this.splatMesh&&(this.splatMesh.dispose(),this.splatMesh=null),this.sceneHelper&&(this.sceneHelper.dispose(),this.sceneHelper=null),this.resizeObserver&&(this.resizeObserver.unobserve(this.rootElement),this.resizeObserver=null),this.disposeSortWorker(),this.removeEventHandlers(),this.loadingSpinner.removeAllTasks(),this.loadingSpinner.setContainer(null),this.loadingProgressBar.hide(),this.loadingProgressBar.setContainer(null),this.infoPanel.setContainer(null),this.camera=null,this.threeScene=null,this.splatRenderReady=!1,this.initialized=!1,this.renderer&&(this.usingExternalRenderer||(this.rootElement.removeChild(this.renderer.domElement),this.renderer.dispose()),this.renderer=null),this.usingExternalRenderer||document.body.removeChild(this.rootElement),this.sortWorkerSortedIndexes=null,this.sortWorkerIndexesToSort=null,this.sortWorkerPrecomputedDistances=null,this.sortWorkerTransforms=null,this.disposed=!0,this.disposing=!1,this.disposePromise=null}),t.forEach(n=>{n.abort("Scene disposed")}),this.disposePromise}selfDrivenUpdate(){this.selfDrivenMode&&!this.webXRMode&&(this.requestFrameId=requestAnimationFrame(this.selfDrivenUpdateFunc)),this.update(),this.shouldRender()?(this.render(),this.consecutiveRenderFrames++):this.consecutiveRenderFrames=0,this.renderNextFrame=!1}forceRenderNextFrame(){this.renderNextFrame=!0}update(e,t){this.dropInMode&&this.updateForDropInMode(e,t),!(!this.initialized||!this.splatRenderReady||this.isDisposingOrDisposed())&&(this.controls&&(this.controls.update(),this.camera.isOrthographicCamera&&!this.usingExternalCamera&&Gn.setCameraPositionFromZoom(this.camera,this.camera,this.controls)),this.runSplatSort(),this.updateForRendererSizeChanges(),this.updateSplatMesh(),this.updateMeshCursor(),this.updateFPS(),this.timingSensitiveUpdates(),this.updateInfoPanel(),this.updateControlPlane())}updateForDropInMode(e,t){this.renderer=e,this.splatMesh&&this.splatMesh.setRenderer(this.renderer),this.camera=t,this.controls&&(this.controls.object=t),this.init()}updateControlPlane(){this.showControlPlane?(this.sceneHelper.setControlPlaneVisibility(!0),this.sceneHelper.positionAndOrientControlPlane(this.controls.target,this.camera.up)):this.sceneHelper.setControlPlaneVisibility(!1)}getSplatMesh(){return this.splatMesh}getSplatScene(e){return this.splatMesh.getScene(e)}getSceneCount(){return this.splatMesh.getSceneCount()}isMobile(){return navigator.userAgent.includes("Mobi")}};Z(Gn,"setCameraPositionFromZoom",function(){const e=new I;return function(t,n,i){const r=1/(n.zoom*.001);e.copy(i.target).sub(t.position).normalize().multiplyScalar(r).negate(),t.position.copy(i.target).add(e)}}()),Z(Gn,"setCameraZoomFromPosition",function(){const e=new I;return function(t,n,i){const r=e.copy(i.target).sub(n.position).length();t.zoom=1/(r*.001)}}());let so=Gn;function mA(s){var t;const e=((t=s.split(/[?#]/,1)[0])==null?void 0:t.toLowerCase())??"";return e.endsWith(".ksplat")?"ksplat":e.endsWith(".splat")?"splat":"ply"}class gA{constructor(e){Z(this,"canvas");Z(this,"events");Z(this,"viewer",null);Z(this,"renderer",null);Z(this,"scene",null);Z(this,"camera",null);Z(this,"sceneBounds",new sn);Z(this,"sceneLoaded",!1);Z(this,"splatCount",0);Z(this,"initialPosition",new I);Z(this,"initialQuaternion",new ut);Z(this,"initialFov",60);Z(this,"lastFrameTime",performance.now());Z(this,"fpsSamples",[]);Z(this,"animationFrameId",null);Z(this,"frameHook",null);this.canvas=e.canvas,this.events=e.events}async init(){this.viewer=new so({canvas:this.canvas,initialCameraPosition:[0,0,3],initialCameraLookAt:[0,0,0],selfDrivenMode:!1,useWorkers:!0,workerConfig:{crossOriginIsolated:!1}}),await this.viewer.init(),this.renderer=this.viewer.renderer,this.scene=this.viewer.scene,this.camera=this.viewer.camera,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.startRenderLoop()}async loadScene(e){if(!this.viewer)throw new Error("Viewer not initialized");this.sceneLoaded=!1,this.events.emit("scene:progress",{percent:0,message:"Starting download…"});try{await this.viewer.addSplatScene(e,{format:this.toSceneFormat(mA(e)),onProgress:(t,n,i)=>{this.events.emit("scene:progress",{percent:Math.round(t),message:`${this.stageToLabel(i)} (${Math.round(t)}%)`})}})}catch(t){const n=t instanceof Error?t.message:"Unknown load error";throw this.events.emit("scene:error",{message:n}),t}await new Promise(t=>requestAnimationFrame(()=>t())),this.splatCount=this.readSplatCount(),this.computeSceneBounds(),this.frameScene(),this.saveInitialCamera(),this.sceneLoaded=!0,this.events.emit("scene:loaded",{splatCount:this.splatCount})}resize(e,t){!this.renderer||!this.camera||(this.renderer.setSize(e,t,!1),this.camera.aspect=e/Math.max(t,1),this.camera.updateProjectionMatrix())}setFrameHook(e){this.frameHook=e}frameScene(){var a,o,l,c,u,d;if(!this.camera||this.sceneBounds.isEmpty())return;const e=new I,t=new _r;this.sceneBounds.getBoundingSphere(t),this.sceneBounds.getCenter(e);const n=fo.degToRad(this.camera.fov),i=t.radius/Math.tan(n/2)*1.3,r=e.clone().add(new I(0,t.radius*.3,i));this.camera.position.copy(r),this.camera.lookAt(e),(l=(o=(a=this.viewer)==null?void 0:a.controls)==null?void 0:o.target)==null||l.copy(e),(d=(u=(c=this.viewer)==null?void 0:c.controls)==null?void 0:u.update)==null||d.call(u)}resetView(){var e,t,n;this.camera&&(this.camera.position.copy(this.initialPosition),this.camera.quaternion.copy(this.initialQuaternion),this.camera.fov=this.initialFov,this.camera.updateProjectionMatrix(),(n=(t=(e=this.viewer)==null?void 0:e.controls)==null?void 0:t.update)==null||n.call(t))}getCamera(){return this.camera}getFPS(){if(this.fpsSamples.length===0)return 0;const e=this.fpsSamples.reduce((t,n)=>t+n,0)/this.fpsSamples.length;return Math.round(e)}getSplatCount(){return this.splatCount}isSceneLoaded(){return this.sceneLoaded}dispose(){var e,t;this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),(t=(e=this.viewer)==null?void 0:e.dispose)==null||t.call(e)}toSceneFormat(e){return e==="splat"?It.Splat:e==="ksplat"?It.KSplat:It.Ply}stageToLabel(e){return{0:"Requesting",1:"Downloading",2:"Processing",3:"Uploading to GPU"}[e]??"Loading"}startRenderLoop(){const e=()=>{var i,r,a;const t=performance.now(),n=t-this.lastFrameTime;this.lastFrameTime=t,n>0&&(this.fpsSamples.push(1e3/n),this.fpsSamples.length>60&&this.fpsSamples.shift()),(i=this.frameHook)==null||i.call(this),(r=this.viewer)==null||r.update(),(a=this.viewer)==null||a.render(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}readSplatCount(){var e,t,n;try{return((n=(t=(e=this.viewer)==null?void 0:e.splatMesh)==null?void 0:t.getSplatCount)==null?void 0:n.call(t))??0}catch{return 0}}computeSceneBounds(){if(!this.scene)return;const e=new sn().setFromObject(this.scene);e.isEmpty()||this.sceneBounds.copy(e)}saveInitialCamera(){this.camera&&(this.initialPosition.copy(this.camera.position),this.initialQuaternion.copy(this.camera.quaternion),this.initialFov=this.camera.fov)}}function At(s){const e=document.querySelector(s);if(!e)throw new Error(`Missing element: ${s}`);return e}function Js(s){At("#btn-walk-mode").classList.toggle("active",s),At("#walkmode-hud").classList.toggle("visible",s)}function dc(s){for(const e of["#btn-frame-scene","#btn-reset-view","#btn-walk-mode"]){const t=At(e);t.disabled=!s}}async function AA(){const s=At("#splat-canvas"),e=At("#scene-url-input"),t=At("#btn-load-scene"),n=At("#loading-overlay"),i=At("#progress-fill"),r=At("#progress-label"),a=At("#status-note"),o=At("#stat-count"),l=At("#stat-scene"),c=At("#stat-fps"),u=new Dg,d=new gA({canvas:s,events:u});await d.init();const p=d.getCamera();if(!p)throw new Error("Viewer camera is unavailable after initialization");const h=new Ig({camera:p,canvas:s});d.setFrameHook(()=>{h.isActive()&&h.update()});const g=()=>{const f=s.parentElement;f&&d.resize(f.clientWidth,f.clientHeight)};g(),window.addEventListener("resize",g),window.addEventListener("beforeunload",()=>d.dispose());const A=async f=>{n.classList.remove("hidden"),i.style.width="0%",r.textContent="Starting…",a.textContent="Loading scene…",l.textContent="loading",dc(!1),Js(!1),h.disable();try{await d.loadScene(f)}catch(m){const x=m instanceof Error?m.message:"Unknown load error";r.textContent=`Error: ${x}`,a.textContent="Scene load failed. Try another public URL or preset."}};document.querySelectorAll(".source-tab").forEach(f=>{f.addEventListener("click",()=>{document.querySelectorAll(".source-tab").forEach(x=>{x.classList.remove("active")}),f.classList.add("active");const m=f.dataset.tab;At("#tab-url").style.display=m==="url"?"block":"none",At("#tab-presets").style.display=m==="presets"?"block":"none"})});for(const f of Pg){const m=document.createElement("button");m.className="preset-btn",m.title=f.description,m.innerHTML=`
      <span class="preset-name">${f.name}</span>
      <span class="preset-meta">${f.sizeMB} MB · ${f.description}</span>
    `,m.addEventListener("click",()=>{var x;e.value=f.url,(x=document.querySelector('[data-tab="url"]'))==null||x.click(),A(f.url)}),At("#preset-grid").appendChild(m)}t.addEventListener("click",()=>{const f=e.value.trim();f&&A(f)}),e.addEventListener("keydown",f=>{f.key==="Enter"&&t.click()}),At("#btn-frame-scene").addEventListener("click",()=>{d.frameScene()}),At("#btn-reset-view").addEventListener("click",()=>{d.resetView()}),At("#btn-walk-mode").addEventListener("click",()=>{if(h.isActive()){h.disable(),Js(!1);return}h.enable(),Js(!0)}),document.addEventListener("walkmode:exit",()=>{Js(!1)}),u.on("scene:progress",({percent:f,message:m})=>{i.style.width=`${f}%`,r.textContent=m}),u.on("scene:loaded",({splatCount:f})=>{n.classList.add("hidden"),dc(!0),o.textContent=f.toLocaleString(),l.textContent="loaded",a.textContent="Scene loaded. Use Frame Scene, Reset View, or Walk Mode to explore."}),u.on("scene:error",({message:f})=>{l.textContent="error",a.textContent=`Scene load failed: ${f}`}),window.setInterval(()=>{const f=d.getFPS();c.textContent=String(f),c.className=`val fps-val${f<20?" bad":f<45?" warn":""}`},500)}AA().catch(s=>{console.error("Initialization failed",s),At("#progress-label").textContent=`Init error: ${s instanceof Error?s.message:"Unknown error"}`,At("#status-note").textContent="Viewer initialization failed."});
