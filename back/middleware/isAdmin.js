const { getUID } = require("../controllers/supabase");

async function isAdmin(req, res, next) {
  const userUid = await getUID(req.params.id);

  if (req.body.uid != userUid.data[0].uid) {
    res.status(403).json("Invalid");
    return;
  }

  next();
}

module.exports = { isAdmin };
