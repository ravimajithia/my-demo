import React, { useCallback, useState } from "react";
import { useAbortController } from "../hooks/useAbortController";
import { Scene, View } from "@novorender/webgl-api";
import { isolateObjects, iterateAsync, showAllObjects, api } from "../helper";

export default function Search({ scene, view}: { scene:Scene, view: View }) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [abortController] = useAbortController();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchField = formData.get("search");
    if (typeof searchField === "string" && searchField.length < 3) {
      showAllObjects(view, scene, api);
      return;
    }
    setSearchTerm(searchField as string);
    await search();
  };

  const getSearchPattern = useCallback(() => {
    return searchTerm;
  }, [searchTerm]);

  const search = useCallback(async () => {
    const abortSignal = abortController.current.signal;
    try {
      // search for objects in sceneview
      const iterator = scene.search({ searchPattern: getSearchPattern() }, abortSignal);
      const [nodes] = await iterateAsync({ iterator, abortSignal, count: 50 });
      isolateObjects(scene, nodes);
    } catch (e) {
      if (abortSignal.aborted) {
        setError('Something went wrong. Please contact support.');
      }
    }
  }, [getSearchPattern, abortController, scene]);

  return (
    <>
      <button onClick={() => setShowForm(!showForm)}>Search</button>
      {showForm && (
        <div className="form-container">
          <form className="search-form" onSubmit={handleSubmit}>
            <span>Please click on top search button to close the form.</span>
            <br />
            <br />
            <input
              name="search"
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          {error && <div className="error">{error}</div>}
        </div>
      )}
    </>
  );
}