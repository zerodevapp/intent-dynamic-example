
"use client";

import { DynamicWidget } from "@/lib/dynamic";
import { useState, useEffect } from "react";
import DynamicMethods from "@/app/components/Methods";
import { useDarkMode } from "@/lib/useDarkMode";
import "./page.css";
import Image from "next/image";

export default function Main() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header">
        <Image
          className="logo"
          src={isDarkMode ? "/logo-light.png" : "/logo-dark.png"}
          alt="dynamic"
          width="300"
          height="60"
        />{" "}
        <div className="header-buttons">
          <button
            className="docs-button"
            onClick={() =>
              window.open(
                "https://docs.dynamic.xyz",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Docs
          </button>
          <button
            className="get-started"
            onClick={() =>
              window.open(
                "https://app.dynamic.xyz",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Get started
          </button>
        </div>
      </div>
      <div className="modal">
        <DynamicWidget />
        <DynamicMethods isDarkMode={isDarkMode} />
      </div>
      <div className="footer">
        <div className="footer-text">Made with 💙 by dynamic</div>
        <Image
          className="footer-image"
          src={isDarkMode ? "/image-dark.png" : "/image-light.png"}
          alt="dynamic"
          width="400"
          height="300"
        />
      </div>
    </div>
  );
}
