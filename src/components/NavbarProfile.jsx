import {faKey, faReceipt, faShoppingBag, faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {Link} from 'react-router-dom';

const NavbarProfile = () => {
	const links = [
		{name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} color="black" />},
		{
			name: 'Information',
			link: '/info',
			icon: <FontAwesomeIcon icon={faReceipt} color="black" />,
		},
		{
			name: 'My Orders',
			link: '/my-order',
			icon: <FontAwesomeIcon icon={faShoppingBag} color="black" />,
		},
		{name: 'Change Password', icon: <FontAwesomeIcon icon={faKey} color="black" />},
	];
	return (
		<nav className="divide-x w-64 bg-white min-h-96 rounded-lg">
			<ul className="">
				{links.map((link, index) => (
					<li key={index} className="text-left md:cursor-pointer px-10 py-5 flex">
						<div className="mr-5">{link.icon}</div>
						<div>
							<Link
								to={link.link}
								className="no-underline text-black m-auto hover:text-primary"
							>
								{link.name}
							</Link>
						</div>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default NavbarProfile;
