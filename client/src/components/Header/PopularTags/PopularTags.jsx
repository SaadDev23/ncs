/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Bitcoin1 } from "../../icons/Bitcoin1";
import { Blogging2 } from "../../icons/Blogging2";
import { Design1 } from "../../icons/Design1";
import { Dev3 } from "../../icons/Dev3";
import { Seo2 } from "../../icons/Seo2";
import { Tutorial1 } from "../../icons/Tutorial1";
import "./style.css";

export const PopularTags = ({
  dark,
  className,
  mainClassName,
  text = "Popular Tags",
  text1 = "#javascript",
  text2 = "82,645 Posted by this tag",
  icon = <Bitcoin1 className="instance-node" color="#FF8F67" />,
  text3 = "#bitcoin",
  text4 = "65,523 Posted • Trending",
  text5 = "#design",
  text6 = "51,354 • Trending in Bangladesh",
  text7 = "#blogging",
  text8 = "48,029 Posted by this tag",
  text9 = "#tutorial",
  text10 = "#seo",
}) => {
  return (
    <div className={`popular-tags ${dark} ${className}`}>
      <div className={`div ${mainClassName}`}>
        <div className="title">
          <div className="text-wrapper">{text}</div>
        </div>
        <div className="tags">
          <div className="tag">
            <div className="icon">
              <Dev3 className="instance-node" color="#EEA956" />
            </div>
            <div className="name">
              <div className="javascript">{text1}</div>
              <p className="element-posted-by">{text2}</p>
            </div>
          </div>
          <div className="tag">
            <div className="bitcoin-wrapper">{icon}</div>
            <div className="name">
              <div className="bitcoin">{text3}</div>
              <div className="element-posted">{text4}</div>
            </div>
          </div>
          <div className="tag">
            <div className="design-wrapper">
              <Design1 className="instance-node" color="#5D95E8" />
            </div>
            <div className="name">
              <div className="design">{text5}</div>
              <p className="element-trending-in">{text6}</p>
            </div>
          </div>
          <div className="tag">
            <div className="blogging-wrapper">
              <Blogging2 className="instance-node" color="#EA942C" />
            </div>
            <div className="name">
              <div className="blogging">{text7}</div>
              <p className="p">{text8}</p>
            </div>
          </div>
          <div className="tag">
            <div className="tutorial-wrapper">
              <Tutorial1 className="instance-node" color="#3ED6A4" />
            </div>
            <div className="name">
              <div className="tutorial">{text9}</div>
              <p className="element-trending-in-2">{text6}</p>
            </div>
          </div>
          <div className="tag">
            <div className="seo-wrapper">
              <Seo2 className="instance-node" color="#848DF9" />
            </div>
            <div className="name">
              <div className="seo">{text10}</div>
              <p className="element-posted-by-2">{text2}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PopularTags.propTypes = {
  dark: PropTypes.oneOf(["off", "on"]),
  text: PropTypes.string,
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
  text5: PropTypes.string,
  text6: PropTypes.string,
  text7: PropTypes.string,
  text8: PropTypes.string,
  text9: PropTypes.string,
  text10: PropTypes.string,
};
