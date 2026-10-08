from typing import List, Optional, Union

from pydantic import BaseModel, Field


class WheelInspectionRequest(BaseModel):
    """Input for a wheel visual inspection."""

    wheel_id: str = Field(
        ...,
        description="Unique wheel/rim tracking ID"
    )

    image_path: str = Field(
        ...,
        description="Path or identifier of the wheel image to inspect"
    )

    batch_id: Optional[str] = Field(
        default=None,
        description="Casting batch or production lot, when available"
    )

    machine_id: Optional[str] = Field(
        default=None,
        description="Die-casting machine or production station, when available"
    )


class WheelAIOutputContract(BaseModel):
    """
    Common output contract shared between AI models and the backend.

    Provisional: exact fields and defect categories will be finalized
    after the dataset is verified.
    """

    wheel_id: str

    batch_id: Optional[str] = None
    machine_id: Optional[str] = None

    defect_type: Optional[str] = None

    location: Optional[Union[str, List[float]]] = Field(
        default=None,
        description="Bounding box [x, y, w, h] or spatial reference"
    )

    severity: Optional[str] = Field(
        default=None,
        description="Low or Critical"
    )

    defect_confidence: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0
    )

    root_cause: Optional[str] = None

    root_cause_confidence: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0
    )

    future_risk: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0
    )

    recommended_action: Optional[str] = None

    affected_batches: List[str] = Field(
        default_factory=list
    )


class DefectQuery(BaseModel):
    batch_id: Optional[str] = None
    machine_id: Optional[str] = None
    severity: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    service: str = "Aluminium Wheel Quality Intelligence Backend"
    version: str = "0.1.0"