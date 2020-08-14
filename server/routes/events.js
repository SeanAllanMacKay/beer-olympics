import express from 'express';

import Event from '@db/schemas/Event';
import Team from '@db/schemas/Team';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(async (req, res) => {
    Event.find({}, (findError, docs) => {
      if (findError) return res.status(500).send({ success: false });

      return res.status(200).send({ success: true, docs });
    });
  })
  .post(async (req, res) => {
    const { eventName } = req.body;

    Team.find({}, (err, docs) => {
      if (err) return res.status(500).send({ success: false });

      if (docs.length % 2 == 1) {
        docs.push(null);
      }

      const teamCount = docs.length;
      const rounds = teamCount - 1;
      const half = teamCount / 2;

      const tournamentPairings = [];

      const playerIndexes = docs.map((_, i) => i).slice(1);

      for (let round = 0; round < rounds; round++) {
        const roundPairings = [];

        const newPlayerIndexes = [0].concat(playerIndexes);

        const firstHalf = newPlayerIndexes.slice(0, half);
        const secondHalf = newPlayerIndexes.slice(half, teamCount).reverse();

        for (let i = 0; i < firstHalf.length; i++) {
          roundPairings.push({
            teams: [
              docs[firstHalf[i]] ? docs[firstHalf[i]]._id : null,
              docs[secondHalf[i]] ? docs[secondHalf[i]]._id : null,
            ],
            winner: null,
          });
        }

        // rotating the array
        playerIndexes.push(playerIndexes.shift());
        tournamentPairings.push(roundPairings);
      }

      Event.create(
        {
          title: eventName,
          rounds: tournamentPairings,
        },
        (err, event) => {
          if (err) return res.status(500).send({ success: false });

          return res.status(200).send({ success: true, docs: event });
        }
      );
    });
  })
  .patch(async (req, res) => {
    const { _id } = req.body;

    Team.find({}, (err, docs) => {
      if (err) return res.status(500).send({ success: false });

      if (docs.length % 2 == 1) {
        docs.push(null);
      }

      const teamCount = docs.length;
      const rounds = teamCount - 1;
      const half = teamCount / 2;

      const tournamentPairings = [];

      const playerIndexes = docs.map((_, i) => i).slice(1);

      for (let round = 0; round < rounds; round++) {
        const roundPairings = [];

        const newPlayerIndexes = [0].concat(playerIndexes);

        const firstHalf = newPlayerIndexes.slice(0, half);
        const secondHalf = newPlayerIndexes.slice(half, teamCount).reverse();

        for (let i = 0; i < firstHalf.length; i++) {
          roundPairings.push({
            teams: [
              docs[firstHalf[i]] ? docs[firstHalf[i]]._id : null,
              docs[secondHalf[i]] ? docs[secondHalf[i]]._id : null,
            ],
            winner: null,
          });
        }

        // rotating the array
        playerIndexes.push(playerIndexes.shift());
        tournamentPairings.push(roundPairings);
      }

      Event.findOne({ _id }, (error, event) => {
        if (error) return res.status(500).send({ success: false });

        event.rounds = tournamentPairings;

        event.save();

        res.status(200).send({ success: true });
      });
    });
  })
  .delete(async (req, res) => {
    const { _id } = req.body;

    Team.deleteOne({ _id }, async (findError, docs) => {
      if (findError) return res.status(500).send({ success: false });

      return res.status(200).send({ success: true });
    });
  });

export default { router };
