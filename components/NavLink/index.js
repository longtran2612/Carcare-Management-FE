import React from "react";
import Link from "next/link";
// import styled from "styled-components";

const NavLink = ({ href, name }) => {
  return (
    <Link href={href} passHref>
      {name}
    </Link>
  );
};

export default NavLink;
