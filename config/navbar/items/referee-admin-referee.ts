export default [
  {
    label: 'navbar.referee.label',
    items: [
      {
        label: 'navbar.referee.calendar',
        to: '/referee',
      },
      {
        separator: true,
      },
      {
        label: 'navbar.federation.leagues.label',
        to: '/referee/admin/leagues',
      },
      {
        // label: 'navbar.referee.admin.referees',
        label: 'navbar.federation.referees.label',
        to: '/referee/admin/referees',
      },
    ],
  },
]
