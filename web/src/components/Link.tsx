import type { FC } from 'react';
import type { AnchorProps } from '@mantine/core';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';
import { Anchor } from '@mantine/core';
import { Link as RouterLink } from 'react-router-dom';

type GenericLinkProps = AnchorProps & RouterLinkProps;

export const Link: FC<GenericLinkProps> = ({ to, children, ...props }) => {
	return (
		<Anchor component={RouterLink} to={to} {...props}>
			{children}
		</Anchor>
	);
};
