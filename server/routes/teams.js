import express from 'express';

import Team from '@db/schemas/Team';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(async (req, res) => {
    Team.find({}, (findError, docs) => {
      if (findError) return res.status(500).send({ success: false });
      return res.status(200).send({ success: true, docs });
    });
  })
  .post(async (req, res) => {
    const { playerOne, playerTwo, country } = req.body;

    Team.create(
      {
        playerOne,
        playerTwo,
        country,
        points: 0,
      },
      (err, team) => {
        if (err) return res.status(500).send({ success: false });

        Team.find({}, (findError, docs) => {
          if (findError) return res.status(500).send({ success: false });
          return res.status(200).send({ success: true, docs });
        });
      }
    );
  })
  .patch(async (req, res) => {
    const { _id, playerTwo, points } = req.body;

    Team.findOne({ _id }, async (findError, docs) => {
      if (findError) return res.status(500).send({ success: false });

      if (docs) {
        if (playerTwo) docs.playerTwo = playerTwo;

        if (points || points === 0) docs.points = points;

        await docs.save();
        return res.status(200).send({ success: true, docs });
      } else {
        return res
          .status(404)
          .send({ success: false, message: 'Team not found' });
      }
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
