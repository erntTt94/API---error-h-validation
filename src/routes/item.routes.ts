import { Router } from "express";
import { v4 as uuid } from "uuid";
import { Item } from "../models/item.model";

const router = Router();
const items: Item[] = [];

type Params = { id: string };

router.get<{}, Item[], {}, {}>("/", (req, res, next) => {
  try {
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

router.get<Params, {} | { error: string }, {}, {}>("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const item = items.find((i) => i.id === id);
    if (!item) {
      res.status(404).json({ error: `Item with id: ${id} not found.` });
    } else {
      res.status(200).json(item);
    }
  } catch (err) {
    next(err);
  }
});

router.post<{}, Item | { error: string }, { name: string }, {}>(
  "/",
  (req, res, next): void => {
    try {
      const { name } = req.body;

      if (typeof name !== "string" || name.trim() === "") {
        res
          .status(400)
          .json({ error: "Name is required and must be a non-empty string." });
      }

      const newItem: Item = { id: uuid(), name: name.trim() };
      items.push(newItem);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  }
);

router.put<Params, Item | { error: string }, { name: string }, {}>(
  "/:id",
  (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name || typeof name !== "string") {
        res
          .status(400)
          .json({ error: "Name is required and must be a non-empty string." });
      }

      const item = items.find((i) => i.id === id);

      if (!item) {
        res.status(404).json({ error: `Item with id: ${id} not found.` });
      } else {
        item.name = name;
        res.status(200).json(item);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.delete<Params, { message: string } | { error: string }, {}, {}>(
  "/:id",
  (req, res, next) => {
    try {
      const { id } = req.params;
      const idx = items.findIndex((i) => i.id === id);

      if (idx === -1) {
        res.status(404).json({ error: `Item with id: ${id} not found.` });
      } else {
        items.splice(idx, 1);
        res.status(200).json({ message: "Item deleted." });
      }
    } catch (err) {
      next(err);
    }
  }
);

export default router;
