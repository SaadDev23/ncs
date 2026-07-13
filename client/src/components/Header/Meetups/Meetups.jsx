// /*
// We're constantly improving the code you see. 
// Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
// */

// import PropTypes from "prop-types";
// import React from "react";
// import { Vector171 } from "../../icons/Vector171";
// import "./style.css";

// export const Meetups = ({
//   dark,
//   className,
//   text = "Meetups",
//   text1 = "UIHUT - Crunchbase Company Profile...",
//   text2 = "UIHUT&nbsp;&nbsp;•&nbsp;&nbsp;Sylhet, Bangladesh",
//   text3 = "Design Meetups USA | Dribbble",
//   text4 = "Dribbble&nbsp;&nbsp;•&nbsp;&nbsp;Austin, Texas, USA",
//   text5 = "Meetup Brand Identity Design - Beha...",
//   rectangle = "/imgHome/rectangle-32-5.svg",
//   text6 = "Behance&nbsp;&nbsp;•&nbsp;&nbsp;Sab jose, Califonia, USA",
// }) => {
//   return (
//     <div className={`meetups dark-20-${dark} ${className}`}>
//       <div className="main-3">
//         <div className="title-2">
//           <div className="text-wrapper-3">{text}</div>
//           <Vector171 className="vector" color={dark === "on" ? "#F7F7F7" : "#3F4354"} />
//         </div>
//         <div className="div-2">
//           <div className="date">
//             <div className="text-wrapper-4">FEB</div>
//             <div className="text-wrapper-5">7</div>
//           </div>
//           <div className="data">
//             <div className="title-3">
//               <p className="UIHUT-crunchbase">{text1}</p>
//               <div className="profile">
//                 <img className="rectangle" alt="Rectangle" src="/imgHome/rectangle-32-3.png" />
//                 <div className="text-wrapper-6">{text2}</div>
//               </div>
//             </div>
//             <div className="tags-2">
//               <div className="div-wrapper">
//                 <div className="text-wrapper-7">Remote</div>
//               </div>
//               <div className="tag-2">
//                 <div className="text-wrapper-7">Part-time</div>
//               </div>
//               <div className="tag-3">
//                 <div className="text-wrapper-7">Worldwide</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="div-2">
//           <div className="date-2">
//             <div className="text-wrapper-8">FEB</div>
//             <div className="text-wrapper-5">3</div>
//           </div>
//           <div className="data">
//             <div className="title-3">
//               <p className="design-meetups-USA">{text3}</p>
//               <div className="profile">
//                 <img className="rectangle" alt="Rectangle" src="/imgHome/rectangle-32-4.png" />
//                 <div className="text-wrapper-6">{text4}</div>
//               </div>
//             </div>
//             <div className="tags-2">
//               <div className="tag-4">
//                 <div className="text-wrapper-7">Remote</div>
//               </div>
//               <div className="tag-5">
//                 <div className="text-wrapper-7">Part-time</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="div-2">
//           <div className="date-3">
//             <div className="text-wrapper-9">FEB</div>
//             <div className="text-wrapper-10">5</div>
//           </div>
//           <div className="data">
//             <div className="title-3">
//               <p className="meetup-brand">{text5}</p>
//               <div className="profile">
//                 <img
//                   className="rectangle"
//                   alt="Rectangle"
//                   src={dark === "on" ? rectangle : "/imgHome/rectangle-32-2.svg"}
//                 />
//                 <div className="text-wrapper-6">{text6}</div>
//               </div>
//             </div>
//             <div className="tags-2">
//               <div className="tag-6">
//                 <div className="text-wrapper-7">Full Time</div>
//               </div>
//               <div className="tag-7">
//                 <div className="text-wrapper-7">Contract</div>
//               </div>
//               <div className="tag-8">
//                 <div className="text-wrapper-7">Worldwide</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Meetups.propTypes = {
//   dark: PropTypes.oneOf(["off", "on"]),
//   text: PropTypes.string,
//   text1: PropTypes.string,
//   text2: PropTypes.string,
//   text3: PropTypes.string,
//   text4: PropTypes.string,
//   text5: PropTypes.string,
//   rectangle: PropTypes.string,
//   text6: PropTypes.string,
// };
