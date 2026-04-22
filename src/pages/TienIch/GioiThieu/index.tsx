import React from 'react';

export default function About() {
	return (
		<div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
			<img src="https://via.placeholder.com/120" alt="avatar" style={{ borderRadius: '50%' }} />
			<h2>Nguyễn Văn A</h2>
			<p>Lập trình viên Frontend, yêu thích React, Typescript, UI/UX.</p>
			<h3>Kỹ năng</h3>
			<ul>
				<li>ReactJS, NextJS</li>
				<li>Typescript, Javascript</li>
				<li>HTML, CSS, SCSS</li>
				<li>Ant Design, Material UI</li>
			</ul>
			<h3>Liên kết</h3>
			<a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |{' '}
			<a href="https://github.com" target="_blank" rel="noopener noreferrer">Github</a>
		</div>
	);
}
