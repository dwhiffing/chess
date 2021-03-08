(this.webpackJsonpdeception=this.webpackJsonpdeception||[]).push([[0],{1410:function(e,t){},1424:function(e,t,n){},1425:function(e,t,n){"use strict";n.r(t);var r=n(16),c=n(2),a=n(0),o=n(9),i=n.n(o),s=n(11),l=n(24),u=n(1462),d=function(e){var t=e.variant,n=e.flex,r=void 0===n?1:n,a=e.children,o=e.style,i=void 0===o?{}:o,d=Object(l.a)(e,["variant","flex","children","style"]),j={display:"flex",flex:r};return/column/.test(t)&&(j.flexDirection="column"),/justify-between/.test(t)&&(j.justifyContent="space-between"),/align-center/.test(t)?j.alignItems="center":/justify-center/.test(t)?j.justifyContent="center":/center/.test(t)&&(j.justifyContent="center",j.alignItems="center"),Object(c.jsx)(u.a,Object(s.a)(Object(s.a)({style:Object(s.a)(Object(s.a)({},j),i)},d),{},{children:a}))};var j={players:[],activeCrime:[],sceneDeck:{toJSON:function(){return[]}},roundsLeft:-1,phaseIndex:-1,phaseTimer:-1},m=[5,6,7],b=n(1458),h=n(1456),f=function(e){var t=e.variant,n=void 0===t?"contained":t,r=Object(l.a)(e,["variant"]);return Object(c.jsx)(h.a,Object(s.a)(Object(s.a)({variant:n},r),{},{style:{margin:8}}))},O=["PRE-GAME","MURDER PHASE","EVIDENCE PHASE","PRESENTATION PHASE"],x=["#0071AA","#ECE4B7","#E8C340","#D33830","#A06033","#EA9438","#E27C81","#7FC12E","#525252","#AA5BAF"],p=function(e){return Object(c.jsxs)(d,{className:"header",variant:"row align-center justify-between",children:[Object(c.jsx)(f,{onClick:e.room.leave.bind(e.room),children:"Leave"}),Object(c.jsx)(b.a,{style:{minWidth:50},children:O[e.phase+1]}),Object(c.jsx)(b.a,{style:{minWidth:50},children:2===e.phase?e.phaseTimer:""})]})},v=function(e){var t=e.children,n=e.selected,r=e.backgroundColor,a=e.onClick;return Object(c.jsx)(d,{className:"card",variant:"center",onClick:a,style:{border:n?"4px solid black":null,backgroundColor:r},children:Object(c.jsx)(b.a,{style:{fontWeight:"bold",textAlign:"center",color:"white"},children:t})})},y=function(e){var t=e.cards,n=e.selected,r=void 0===n?function(){return!1}:n,a=Object(l.a)(e,["cards","selected"]);return Object(c.jsx)(d,{style:{width:"100%",flexWrap:"wrap"},children:t.map((function(e,t){return Object(c.jsx)(d,{variant:"center",children:Object(c.jsx)(v,{backgroundColor:a.getBackgroundColor(t),selected:r(e),onClick:function(){return a.onClick(e)},style:{minWidth:100},children:e})},"card-".concat(t))}))})},g=function(e){return e.renderEvidence&&Object(c.jsx)(d,{variant:"justify-between",style:{flexWrap:"wrap"},children:e.scene.map((function(t,n){return Object(c.jsx)(k,{role:e.role,room:e.room,item:t},"s".concat(n))}))})},k=function(e){var t=e.item,n=e.room,r=e.role;return Object(c.jsxs)(d,{variant:"column align-center",style:{margin:8,minWidth:300},children:[Object(c.jsx)(b.a,{variant:"h5",align:"center",children:t.type}),Object(c.jsx)(y,{cards:t.values.filter((function(e,n){return 1===r?n===t.markedValueIndex||-1===t.markedValueIndex:n===t.markedValueIndex})),getBackgroundColor:function(e){return-1===t.markedValueIndex?"gray":"#D33830"},onClick:function(e){return n.send("MarkEvidence",{type:t.type,value:e})}})]})},C=function(e){return e.renderSeats&&Object(c.jsx)(d,{flex:2,variant:"column",children:e.players.map((function(t,n){return Object(c.jsx)(w,Object(s.a)({player:t,index:n},e),"p".concat(n))}))})},w=function(e){var t=e.player,n=e.index,a=e.phase,o=e.role,i=Object(l.a)(e,["player","index","phase","role"]),s=i.currentPlayer.isAdmin&&-1===a,u=t.id,j=t.name||t.id,m=u===i.currentPlayer.id,h=0===a&&m&&2===o||2===a&&!m&&1!==o,O=h?"FF":"55",p={border:"5px solid ".concat(x[n]),margin:10,padding:10},v=t.guess||[],g=Object(r.a)(v,3),k=g[0],C=g[1],w=g[2],S=k&&C?i.players.find((function(e){return e.clues.includes(k)||e.means.includes(C)})):null,I=k&&C?"Accused ".concat(S.name," with ").concat(C," and ").concat(k,". ").concat(w?"It was close":"It was wrong","."):1!==t.role?"Can still accuse.":"";return u?Object(c.jsxs)(d,{variant:"column",style:p,children:[Object(c.jsxs)(d,{children:[Object(c.jsxs)(b.a,{variant:u===i.currentPlayer.id?"h5":"body1",children:[u===i.currentPlayer.id?"You (".concat(j,")"):j,1===t.role?" (Scientist)":""]}),2===a&&Object(c.jsx)(b.a,{style:{margin:"0 10px 10px",color:"gray"},children:I})]}),!t.connected&&Object(c.jsxs)(b.a,{children:["Disconnected! (",t.remainingConnectionTime," seconds to reconnect)"]}),Object(c.jsx)(y,{cards:t.means,selected:function(e){return e===i.selectedMeans},getBackgroundColor:function(){return"#D33830".concat(O)},onClick:function(e){return h&&i.setSelectedMeans(e)}}),Object(c.jsx)(y,{cards:t.clues,selected:function(e){return e===i.selectedClue},getBackgroundColor:function(){return"#0071AA".concat(O)},onClick:function(e){return h&&i.setSelectedClue(e)}}),-1===a&&i.currentPlayer.isAdmin&&t.id!==i.currentPlayer.id&&Object(c.jsx)(f,{onClick:function(){return i.room.send("Leave",{playerId:t.id})},children:"Kick"}),s&&1!==t.role&&Object(c.jsx)(f,{onClick:function(){return i.room.send("AssignScientist",{playerId:u})},children:"Assign Forensic Scientist"})]}):null},S=function(e){return Object(c.jsx)(d,{flex:0,variant:"center",className:"actions",zIndex:100,children:Object(c.jsxs)(d,{variant:"column center",style:{padding:"4px 0"},children:[-1===e.phase&&Object(c.jsx)(I,Object(s.a)({},e)),0===e.phase&&Object(c.jsx)(E,Object(s.a)({},e)),1===e.phase&&Object(c.jsx)(A,Object(s.a)({},e)),2===e.phase&&Object(c.jsx)(N,Object(s.a)({},e))]})})},I=function(e){var t=e.players,n=e.currentPlayer,o=e.room,i=Object(a.useState)(3),s=Object(r.a)(i,2),l=s[0],u=s[1],j=Object(a.useState)(30),m=Object(r.a)(j,2),b=m[0],h=m[1];return Object(c.jsx)(c.Fragment,{children:n.isAdmin?Object(c.jsxs)(d,{children:[Object(c.jsx)(f,{disabled:0===t.filter((function(e){return 1===e.role})).length,onClick:function(){return o.send("Deal",{numCards:l,phaseTimerMultiple:b})},children:"Deal"}),Object(c.jsxs)(f,{onClick:function(){var e,t=prompt("Set number of means/clue cards to deal to each player (3-5)");u("number"===typeof(e=+t)&&e<=5&&e>=3?e:3)},children:["Set num cards (",l,")"]}),Object(c.jsxs)(f,{onClick:function(){var e,t=prompt("Set time per investigator in seconds (5-120)");h("number"===typeof(e=+t)&&e<=120&&e>=5?e:30)},children:["Set timer duration (",b,")"]})]}):null})},E=function(e){var t=e.currentPlayer,n=e.selectedMeans,r=e.selectedClue,a=e.room;return 2===t.role?Object(c.jsxs)(d,{variant:"column center",children:[(!n||!r)&&Object(c.jsx)(b.a,{children:"Select one of your Red Means cards and Blue Clue cards to plan the murder."}),n&&r&&Object(c.jsxs)(b.a,{children:["You will kill the victim using ",n," and leave behind"," ",r," as evidence."]}),Object(c.jsx)(f,{disabled:!n||!r,onClick:function(){a.send("Murder",{means:n,clue:r})},children:"Commit Murder"})]}):Object(c.jsx)(b.a,{children:"The murder is currently happening"})},A=function(e){var t=e.currentPlayer,n=e.activeCrime,r=e.activeScene,a=e.sceneCardsThisRound,o=e.players,i=a-r.length,s=o.find((function(e){return 2===e.role})),l=o.find((function(e){return 3===e.role}));return 1===t.role?Object(c.jsxs)(b.a,{children:["Mark the crime scene based on the means ",n[1]," and the clue"," ",n[0],". You have ",i," remaining selection",i>1?"s":"","."]}):2===t.role?Object(c.jsxs)(b.a,{children:["You commited the crime via ",n[1]," and the clue ",n[0],"."," ",l?"Your accomplice was ".concat(l.name):""]}):3===t.role?Object(c.jsxs)(b.a,{children:["You were the accomplice of the murder using ",n[1]," and the clue"," ",n[0],". Help the murderer (",s.name,") avoid suspicion."]}):4===t.role?Object(c.jsxs)(b.a,{children:["You saw the murderer (",s.name,") and accomplice (",l.name,") getting away from the scene. Try to draw attention to them without letting them figure out you know. If they can guess you are the witness at the end, they win."]}):Object(c.jsx)(b.a,{children:"The Forensic Scientist is investigating"})},N=function(e){var t=e.currentPlayer,n=e.selectedClue,r=e.activeCrime,a=e.selectedMeans,o=e.room,i=e.role;return 1!==i?Object(c.jsxs)(c.Fragment,{children:[2===i?Object(c.jsxs)(b.a,{children:["You are the murderer. You killed the victim using ",r[1]," and left behind ",r[0]," as evidence. Try to convince the others it wasn't you"]}):Object(c.jsx)(b.a,{children:"Discuss the clues given by Forensics to determine the murderer, and via which means (Red) and key evidence (Blue). You only get one chance to accuse!"}),0===t.guess.length&&Object(c.jsx)(d,{variant:"column center",children:Object(c.jsx)(f,{disabled:!a||!n,onClick:function(){o.send("Accuse",{means:a,clue:n})},children:"Accuse"})})]}):Object(c.jsx)(b.a,{children:"Plan your next clue based on how the investigators responded to your last one!"})},R=n(1465),P=n(1463);function T(e){var t=function(e){var t=e.room,n=e.setRoom,c=Object(a.useState)(j),o=Object(r.a)(c,2),i=o[0],l=o[1],u=Object(a.useState)(),d=Object(r.a)(u,2),b=d[0],h=d[1],f=Object(a.useState)(),O=Object(r.a)(f,2),x=O[0],p=O[1],v=Object(a.useState)(""),y=Object(r.a)(v,2),g=y[0],k=y[1],C=i.sceneDeck,w=i.phaseIndex,S=i.players;Object(a.useEffect)((function(){t&&(t.onStateChange((function(e){e.players.toJSON().some((function(e){return e.id===t.sessionId}))||(t.leave(),localStorage.removeItem(t.id),l(j),n()),l(Object(s.a)({},e))})),t.onMessage("message",(function(e){k(e),setTimeout((function(){return k("")}),5e3)})),t.onLeave((function(){localStorage.removeItem(t.id),l(j),n()})))}),[t,n]),Object(a.useEffect)((function(){h(),p()}),[w]);var I=S.find((function(e){return e.id===t.sessionId}))||{},E=1===w||2===w,A=-1===w||0===w&&2===I.role||1===w&&1!==I.role||2===w,N=m[2-i.roundsLeft],R=C.toJSON().filter((function(e){return e.markedValueIndex>-1})).filter((function(e){var t=e.markedValueIndex;return 1===I.role||t>-1})),P=C.toJSON().slice(0,N+(1===w&&R.length<N?2:-1));return{activeCrime:i.activeCrime.toJSON?i.activeCrime.toJSON():[],message:g,room:t,phase:w,phaseTimer:i.phaseTimer,currentPlayer:I,selectedClue:x,selectedMeans:b,renderSeats:A,renderEvidence:E,sceneCardsThisRound:N,activeScene:R,sceneDeck:P.sort((function(e){return-1===e.markedValueIndex?1:-1})),role:I.role,scene:1===I.role&&1===w?P:R,setSelectedMeans:function(e){return h((function(t){return t===e?null:e}))},setSelectedClue:function(e){return p((function(t){return t===e?null:e}))},players:i.players.toJSON?i.players.toJSON().sort((function(e,t){return 1===e.role?-1:1})):[]}}({room:e.room,setRoom:e.setRoom});return console.log(t),Object(c.jsxs)(d,{variant:"column",style:{paddingTop:70,paddingBottom:200},children:[Object(c.jsx)(p,Object(s.a)({},t)),Object(c.jsx)(g,Object(s.a)({},t)),Object(c.jsx)(C,Object(s.a)({},t)),Object(c.jsx)(S,Object(s.a)({},t)),Object(c.jsx)(R.a,{open:!!t.message,autoHideDuration:8e3,style:{bottom:100},children:Object(c.jsx)(P.a,{elevation:6,variant:"filled",severity:"info",children:t.message})})]})}var D=n(18),M=n.n(D),B=n(39),F=n(1460),J=n(44),Y=n.n(J),V=n(77),W=n.n(V);function H(e){var t=e.setRoom,n=Object(a.useRef)(),o=Object(a.useRef)(!1),i=Object(a.useState)([]),s=Object(r.a)(i,2),l=s[0],u=s[1],j=Object(a.useState)(localStorage.getItem("name")||Y.a.name.firstName()),m=Object(r.a)(j,2),h=m[0],O=m[1],x=Object(a.useCallback)((function(e,n){localStorage.setItem("name",n),localStorage.setItem(e.id,e.sessionId),t(e)}),[t]),p=Object(a.useCallback)(function(){var e=Object(B.a)(M.a.mark((function e(t){var n,r,c;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=prompt("Room name?")){e.next=3;break}return e.abrupt("return");case 3:return r=window.colyseus,e.next=6,r.create("deception",{roomName:n,name:t});case 6:c=e.sent,x(c,t);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[x]),v=Object(a.useCallback)(function(){var e=Object(B.a)(M.a.mark((function e(t,n){var r;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,z(t,n);case 3:if(r=e.sent){e.next=6;break}throw new Error("Failed to join room");case 6:x(r,n),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),alert(e.t0),localStorage.removeItem(t);case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t,n){return e.apply(this,arguments)}}(),[x]),y=Object(a.useCallback)(Object(B.a)(M.a.mark((function e(){return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=u,e.next=3,window.colyseus.getAvailableRooms();case 3:return e.t1=e.sent,e.abrupt("return",(0,e.t0)(e.t1));case 5:case"end":return e.stop()}}),e)}))),[]);return Object(a.useEffect)((function(){return y(),n.current=setInterval(y,3e3),function(){return clearInterval(n.current)}}),[y]),Object(a.useEffect)((function(){if(l){var e=l.find((function(e){return localStorage.getItem(e.roomId)}));e&&!o.current&&(o.current=!0,v(e.roomId,h))}}),[l,v,h]),Object(c.jsxs)(d,{variant:"column center",style:{height:"100vh"},children:[Object(c.jsx)(F.a,{placeholder:"Enter name",value:h,style:{marginBottom:20},onChange:function(e){return O(W()(e.target.value,{length:10,omission:""}))}}),Object(c.jsx)(b.a,{variant:"h5",children:"Available Tables:"}),Object(c.jsxs)(d,{flex:0,variant:"column center",style:{minHeight:200},children:[0===l.length&&Object(c.jsx)(b.a,{children:"No rooms available"}),l.map((function(e){return Object(c.jsx)(L,{room:e,onClick:function(){return v(e.roomId,h)}},e.roomId)}))]}),Object(c.jsx)(f,{onClick:function(){return p(h)},children:"Create room"})]})}var L=function(e){var t=e.room,n=e.onClick;return Object(c.jsx)(u.a,{children:Object(c.jsx)(b.a,{style:{cursor:"pointer",textDecoration:"underline"},onClick:n,children:t.metadata.roomName||t.roomId})})},z=function(){var e=Object(B.a)(M.a.mark((function e(t,n){var r,c;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(c=localStorage.getItem(t))){e.next=12;break}return e.prev=2,e.next=5,window.colyseus.reconnect(t,c);case 5:r=e.sent,e.next=10;break;case 8:e.prev=8,e.t0=e.catch(2);case 10:e.next=18;break;case 12:if(e.t1=r,e.t1){e.next=17;break}return e.next=16,window.colyseus.joinById(t,{name:n});case 16:e.t1=e.sent;case 17:r=e.t1;case 18:return e.abrupt("return",r);case 19:case"end":return e.stop()}}),e,null,[[2,8]])})));return function(t,n){return e.apply(this,arguments)}}(),G=n(78);n(1424);function K(){var e=Object(a.useState)(),t=Object(r.a)(e,2),n=t[0],o=t[1];return n?Object(c.jsx)(T,{room:n,setRoom:o}):Object(c.jsx)(H,{setRoom:o})}window.colyseus=new G.Client("wss://daniel-deception.herokuapp.com"),i.a.render(Object(c.jsx)(K,{}),document.getElementById("root"))}},[[1425,1,2]]]);
//# sourceMappingURL=main.2efe8cdd.chunk.js.map