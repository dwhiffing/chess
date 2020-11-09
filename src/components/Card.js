import React from 'react'
import { Typography } from '@material-ui/core'
import { Flex } from './Flex'

export const Card = ({ children, selected, backgroundColor, onClick }) => (
  <Flex
    className="card"
    variant="center"
    onClick={onClick}
    style={{ border: selected ? '4px solid black' : null, backgroundColor }}
  >
    <Typography
      style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}
    >
      {children}
    </Typography>
  </Flex>
)
