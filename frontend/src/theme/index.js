import { defineStyleConfig, extendTheme } from "@chakra-ui/react";


const Box = defineStyleConfig({
    baseStyle: {
        bg:"green"
    }
})

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    borderRadius: "base",
  },
  sizes: {
    sm: {
      fontSize: "sm",
      px: 4, 
          py: 3,
      },
    md: {
      fontSize: "md",
      px: 6, 
      py: 4, 
    },
  },
 
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "blue.500",
      color: "green.500",
    },
    solid: {
      bg: "green.500",
      color: "white",
    },
  },
  defaultProps: {
    size: "md",
    variant: "outline",
  },
});
const theme = extendTheme({
  components: {
    Box,
    Button
  },
});

export default theme;
