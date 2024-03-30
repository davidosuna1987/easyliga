<template>
  <header class="report-header flex border-solid">
    <div class="report-header-info p-4 flex-1 flex flex-col justify-between">
      <p class="report-competition text-2xl font-semibold">
        Liga provincial de Voleibol Pamplona
      </p>
      <div>
        <p class="mb-2">
          <strong>Instalaciones:</strong> Polideportivo Berriozar (pista 1)
        </p>
        <p><strong>Categoría:</strong> Infantil - Mixto</p>
      </div>
    </div>
    <div
      class="report-header-data border-solid border-y-0 p-4 flex-1 flex flex-col justify-between"
    >
      <div class="grid grid-cols-2 mb-2">
        <p class="report-date"><strong>Fecha:</strong> 12.12.2021</p>
        <p class="report-time"><strong>Hora:</strong> 10:00</p>
      </div>
      <div class="grid grid-cols-2 mb-2">
        <p class="report-local-team"><strong>Local:</strong> Navarvoley A</p>
        <p class="report-visitor-team">
          <strong>Visitante:</strong> Irbarate INF
        </p>
      </div>
      <div>
        <div class="report-teams grid grid-cols-2">
          <div class="report-team flex justify-start items-end">
            <p
              class="report-team-side text-5xl font-semibold mr-3 text-primary"
            >
              A
            </p>
            <p class="report-team-name text-xl leading-5 mb-1.5">
              Irbarate INF
            </p>
          </div>
          <div class="report-team flex justify-end items-end">
            <p class="report-team-name text-xl leading-5 mb-1.5">
              Navarvolei A
            </p>
            <p
              class="report-team-side text-5xl font-semibold ml-3 text-tertiary-dark"
            >
              B
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="report-header-easy py-4 px-12 flex justify-center items-center text-center flex-col"
    >
      <IconEasyLiga size="60" />
      <span class="text-xl font-semibold">EasyLiga</span>
    </div>
  </header>
</template>
