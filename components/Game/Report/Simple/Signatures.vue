<script setup lang="ts">
import { Team } from '@/domain/team'
import { Profile } from '@/domain/profile'
import { getFullName } from '@/domain/player'
import {
  GameSignature,
  GameSignatureTypes,
  getSignatureByType,
} from '@/domain/game-signature'

const props = defineProps({
  referee: {
    type: Object as PropType<Profile>,
    required: true,
  },
  localTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  visitorTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  leftSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  rightSideTeam: {
    type: Object as PropType<Team>,
    required: true,
  },
  signatures: {
    type: Array as PropType<GameSignature[]>,
    required: true,
  },
})
const { t } = useI18n()

const refereeSignature = computed((): GameSignature | undefined => {
  return getSignatureByType(props.signatures, GameSignatureTypes.referee)
})

const localTeamSignatures = computed(
  (): {
    coach: GameSignature | undefined
    captain: GameSignature | undefined
  } => {
    return {
      coach: getSignatureByType(
        props.signatures,
        GameSignatureTypes.coach,
        props.localTeam.id,
      ),
      captain: getSignatureByType(
        props.signatures,
        GameSignatureTypes.captain,
        props.localTeam.id,
      ),
    }
  },
)

const visitorTeamSignatures = computed(
  (): {
    coach: GameSignature | undefined
    captain: GameSignature | undefined
  } => {
    return {
      coach: getSignatureByType(
        props.signatures,
        GameSignatureTypes.coach,
        props.visitorTeam.id,
      ),
      captain: getSignatureByType(
        props.signatures,
        GameSignatureTypes.captain,
        props.visitorTeam.id,
      ),
    }
  },
)
</script>

<template>
  <article class="easy-game-report-signatures-component">
    <header
      class="report-signature-header border-solid p-2 grid place-content-center"
    >
      <strong class="uppercase">{{ t('reports.approval') }}</strong>
    </header>
    <main class="report-signature-main">
      <div class="report-signature-referee grid border-solid border-t-0">
        <div
          class="h-[29.5px] border-solid border-x-0 grid place-content-center"
        >
          <span>{{ t('game_signatures.type.referee') }}</span>
        </div>
        <div class="p-2 pb-0 flex justify-between">
          <span>{{ getFullName(referee) }}</span>
          <!-- <span v-if="referee.license">
            <strong>{{ t('referees.license') }}:</strong>{{referee.license}}
          </span> -->
        </div>
        <figure class="p-2 grid grid-cols-4">
          <img
            v-if="refereeSignature"
            class="col-span-2 col-start-2 w-[90%] mx-auto"
            :src="refereeSignature.signature"
            :alt="t('game_signatures.alt_text.referee')"
          />
        </figure>
      </div>

      <div
        class="report-signature-teams grid grid-cols-2 border-solid border-t-0"
      >
        <GameReportSimpleSidedTeam
          class="border-solid border-l-0 border-t-0 p-2"
          :team="localTeam"
          :leftSideTeam="leftSideTeam"
        />
        <GameReportSimpleSidedTeam
          class="border-solid border-x-0 border-t-0 p-2"
          :team="visitorTeam"
          :leftSideTeam="leftSideTeam"
          direction="right"
        />
        <div>
          <div
            class="report-signature-coach grid place-content-center border-solid border-l-0"
          >
            <div
              class="h-[29.5px] border-solid border-x-0 border-t-0 grid place-content-center"
            >
              <span>{{ t('game_signatures.type.coach') }}</span>
            </div>
            <figure class="p-2 grid grid-cols-4 min-h-[51.5px]">
              <img
                class="col-span-2 col-start-2"
                v-if="localTeamSignatures.coach"
                :src="localTeamSignatures.coach.signature"
                :alt="
                  t('game_signatures.alt_text.coach', {
                    teamName: localTeam.name,
                  })
                "
              />
            </figure>
          </div>

          <div
            class="report-signature-captain grid place-content-center border-solid border-y-0 border-l-0"
          >
            <div
              class="h-[29.5px] border-solid border-x-0 border-t-0 grid place-content-center"
            >
              <span>{{ t('game_signatures.type.captain') }}</span>
            </div>
            <figure class="p-2 grid grid-cols-4 min-h-[51.5px]">
              <img
                class="col-span-2 col-start-2"
                v-if="localTeamSignatures.captain"
                :src="localTeamSignatures.captain.signature"
                :alt="
                  t('game_signatures.alt_text.captain', {
                    teamName: localTeam.name,
                  })
                "
              />
            </figure>
          </div>
        </div>

        <div>
          <div
            class="report-signature-coach grid place-content-center border-solid border-x-0"
          >
            <div
              class="h-[29.5px] border-solid border-x-0 border-t-0 grid place-content-center"
            >
              <span>{{ t('game_signatures.type.coach') }}</span>
            </div>
            <figure class="p-2 grid grid-cols-4 min-h-[51.5px]">
              <img
                class="col-span-2 col-start-2"
                v-if="visitorTeamSignatures.coach"
                :src="visitorTeamSignatures.coach.signature"
                :alt="
                  t('game_signatures.alt_text.coach', {
                    teamName: visitorTeam.name,
                  })
                "
              />
            </figure>
          </div>

          <div class="report-signature-captain grid place-content-center">
            <div
              class="h-[29.5px] border-solid border-x-0 border-t-0 grid place-content-center"
            >
              <span>{{ t('game_signatures.type.captain') }}</span>
            </div>
            <figure class="p-2 grid grid-cols-4 min-h-[51.5px]">
              <img
                class="col-span-2 col-start-2"
                v-if="visitorTeamSignatures.captain"
                :src="visitorTeamSignatures.captain.signature"
                :alt="
                  t('game_signatures.alt_text.captain', {
                    teamName: visitorTeam.name,
                  })
                "
              />
            </figure>
          </div>
        </div>
      </div>
    </main>
  </article>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleSignatures',
}
</script>
