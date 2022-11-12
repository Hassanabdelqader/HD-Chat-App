import React from 'react';
import { MDBFooter } from "mdb-react-ui-kit";


const Footer = () => {
  return (
    <MDBFooter bgColor="light" className="text-center text-lg-left">
      <div
        className="text-center p-3"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          height: "3rem",
          display: "flex",
          justifyContent: "center",
          paddingRight: "3px",
        }}
      >
        &copy; {new Date().getFullYear()} Copyright:
        {" This Website Developed By Hasan "} <br />
        <a
          className="text-dark"
          href="https://github.com/Hassanabdelqader/"
          style={{
            color: "blue",
            marginLeft: "2px",
          }}
        >
          My-GitHub
        </a>{" "}
        <br />
        <a
          className="text-dark"
          href="https://www.linkedin.com/in/hassanabdelqader/"
          style={{
            color: "blue",
            marginLeft: "4px",
          }}
        >
          My-LinkedIn
        </a>
      </div>
    </MDBFooter>
  );
};
export default Footer;