'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ReactPlayer from 'react-player';
import { Job } from '@/types';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const ClipSuggestionsPage = () => {
  const { job_id } = useParams();
  const [url, setUrl] = useState('');

  useEffect(() => {
    // load video file from s3, clips from supabase
    const load = async () => {
      const supabase = createClient();
      const { data: job } = (await supabase.from('jobs').select('*').eq('id', job_id).single()) as {
        data: Job;
      };

      const { url } = await fetch(`/api/download-url?bucket=raw&key=${job.s3_key}`).then((res) =>
        res.json()
      );
      setUrl(url);

      return job;
    };

    load();
  }, [job_id]);

  console.log(url);

  return (
    <div className={`mx-auto max-w-3xl p-4`}>
      {url && <ReactPlayer width="100%" height="auto" url={url} controls />}
      <section>
        <h2>Slide control</h2>
        <RangeSlider
          value={[0, 100]}
          // onChange={(value) => console.log(value)}
          min={0}
          max={100}
          step={1}
        />
      </section>
    </div>
  );
};

export default ClipSuggestionsPage;
